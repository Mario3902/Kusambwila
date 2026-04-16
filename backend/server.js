const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./db');
const auth = require('./auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar DB
initializeDatabase();

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await auth.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/profile', auth.authenticateToken, async (req, res) => {
  try {
    const profile = await auth.getUserProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', auth.authenticateToken, async (req, res) => {
  try {
    const updatedProfile = await auth.updateUserProfile(req.user.id, req.body);
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- PROPERTIES ROUTES ---
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.*,
        CONCAT(u.firstName, ' ', u.lastName) AS landlordName,
        u.email AS landlordEmail,
        dv.biStatus,
        dv.propertyTitleStatus,
        dv.verificationScore,
        dv.isVerified
      FROM properties p
      LEFT JOIN users u ON p.landlordId = u.id
      LEFT JOIN document_verifications dv ON u.id = dv.userId
      ORDER BY p.createdAt DESC
    `);

    const enriched = rows.map((row) => ({
      ...row,
      verification: {
        biStatus: row.biStatus || 'pending',
        propertyTitleStatus: row.propertyTitleStatus || 'pending',
        verificationScore: Number(row.verificationScore || 0),
        isVerified: Boolean(row.isVerified || false)
      }
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Imóvel não encontrado' });
    
    const [images] = await pool.query('SELECT * FROM property_images WHERE propertyId = ?', [req.params.id]);
    const [verif] = await pool.query('SELECT * FROM document_verifications dv JOIN users u ON dv.userId = u.id WHERE u.id = (SELECT landlordId FROM properties WHERE id = ?)', [req.params.id]);
    
    res.json({ ...rows[0], images, verification: verif[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties/publish', auth.authenticateToken, auth.authorizeRole(['landlord', 'admin']), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      district,
      type,
      bedrooms = 0,
      bathrooms = 0,
      area = null,
      featured = false
    } = req.body;

    if (!title || !price || !location || !district || !type) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, price, location, district e type' });
    }

    const [result] = await pool.query(
      `INSERT INTO properties
       (title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        Number(price),
        location,
        district,
        type,
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        area !== null && area !== undefined && area !== '' ? Number(area) : null,
        Boolean(featured),
        req.user.id
      ]
    );

    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update Property (Price, Title, etc)
app.put('/api/admin/properties/:id', auth.authenticateToken, auth.authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, description, price, featured, type } = req.body;
    await pool.query(
      'UPDATE properties SET title = ?, description = ?, price = ?, featured = ?, type = ? WHERE id = ?',
      [title, description, price, featured, type, req.params.id]
    );
    res.json({ message: 'Imóvel atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update Verification Status
app.put('/api/admin/verify/:userId', auth.authenticateToken, auth.authorizeRole(['admin']), async (req, res) => {
  try {
    const { biStatus, propertyTitleStatus, isVerified, verificationScore } = req.body;
    await pool.query(
      'UPDATE document_verifications SET biStatus = ?, propertyTitleStatus = ?, isVerified = ?, verificationScore = ? WHERE userId = ?',
      [biStatus, propertyTitleStatus, isVerified, verificationScore, req.params.userId]
    );
    res.json({ message: 'Status de verificação atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FINANCIALS ROUTES ---
app.get('/api/admin/financials', auth.authenticateToken, auth.authorizeRole(['admin']), async (req, res) => {
  try {
    const [revenue] = await pool.query('SELECT SUM(monthlyRevenue) as total FROM property_financials');
    const [topLandlords] = await pool.query(`
      SELECT u.firstName, u.lastName, SUM(pf.monthlyRevenue) as total_revenue 
      FROM users u 
      JOIN properties p ON u.id = p.landlordId 
      JOIN property_financials pf ON p.id = pf.propertyId 
      GROUP BY u.id ORDER BY total_revenue DESC LIMIT 5
    `);
    res.json({ totalRevenue: revenue[0].total, topLandlords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});