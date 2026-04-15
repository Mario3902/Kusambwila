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

// --- PROPERTIES ROUTES ---
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties');
    res.json(rows);
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