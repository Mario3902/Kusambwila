const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('./db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, userType: user.userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não fornecido' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }

  req.user = user;
  next();
}

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}

async function registerUser(userData) {
  const { firstName, lastName, email, password, phone, userType, biNumber } = userData;
  
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('Email já está em uso');
  }

  const hashedPassword = await hashPassword(password);

  const [result] = await pool.query(
    `INSERT INTO users (firstName, lastName, email, password, phone, userType, biNumber) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, hashedPassword, phone, userType, biNumber || null]
  );

  const userId = result.insertId;

  await pool.query(
    `INSERT INTO document_verifications (userId, biStatus, propertyTitleStatus, addressProofStatus) 
     VALUES (?, 'pending', 'pending', 'pending')`,
    [userId]
  );

  const [newUser] = await pool.query('SELECT id, firstName, lastName, email, phone, userType, biNumber, createdAt FROM users WHERE id = ?', [userId]);
  
  return {
    user: newUser[0],
    token: generateToken({ id: userId, email, userType })
  };
}

async function loginUser(email, password) {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    throw new Error('Credenciais inválidas');
  }

  const user = users[0];
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Credenciais inválidas');
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken({ id: user.id, email: user.email, userType: user.userType });

  return {
    user: userWithoutPassword,
    token
  };
}

async function getUserProfile(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.userType, u.biNumber, 
            u.avatar, u.createdAt, u.updatedAt,
            dv.biStatus, dv.propertyTitleStatus, dv.addressProofStatus, 
            dv.verificationScore, dv.isVerified
     FROM users u
     LEFT JOIN document_verifications dv ON u.id = dv.userId
     WHERE u.id = ?`,
    [userId]
  );

  return rows.length > 0 ? rows[0] : null;
}

async function updateUserProfile(userId, updateData) {
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
  const updates = [];
  const values = [];

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  });

  if (updates.length === 0) {
    throw new Error('Nenhum campo válido para atualização');
  }

  values.push(userId);

  await pool.query(
    `UPDATE users SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return await getUserProfile(userId);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticateToken,
  authorizeRole,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};