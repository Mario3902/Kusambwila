const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool, initializeDatabase } = require("./db");
const auth = require("./auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar multer para upload de arquivos
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas PDF e imagens (JPEG, PNG) são permitidos"));
    }
  },
});

// Servir arquivos estáticos
app.use("/uploads", express.static(uploadDir));

// Inicializar DB
initializeDatabase();

// --- AUTH ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const result = await auth.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/auth/profile", auth.authenticateToken, async (req, res) => {
  try {
    const profile = await auth.getUserProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/auth/profile", auth.authenticateToken, async (req, res) => {
  try {
    const updatedProfile = await auth.updateUserProfile(req.user.id, req.body);
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- DOCUMENT ROUTES ---
// Upload de documento por proprietário
app.post(
  "/api/documents/upload",
  auth.authenticateToken,
  auth.authorizeRole(["landlord"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
      }

      const { documentType } = req.body;
      if (!["bi", "propertyTitle", "addressProof"].includes(documentType)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Tipo de documento inválido" });
      }

      const filePath = `/uploads/${req.file.filename}`;

      const [result] = await pool.query(
        `INSERT INTO documents (userId, documentType, fileName, filePath, fileSize, mimeType, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [
          req.user.id,
          documentType,
          req.file.originalname,
          filePath,
          req.file.size,
          req.file.mimetype,
        ],
      );

      res.status(201).json({
        id: result.insertId,
        userId: req.user.id,
        documentType,
        fileName: req.file.originalname,
        filePath,
        fileSize: req.file.size,
        status: "pending",
        uploadedAt: new Date(),
        message: "Documento enviado com sucesso",
      });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: err.message });
    }
  },
);

// Obter documentos do proprietário
app.get(
  "/api/documents",
  auth.authenticateToken,
  auth.authorizeRole(["landlord"]),
  async (req, res) => {
    try {
      const [documents] = await pool.query(
        `SELECT d.*, u.firstName, u.lastName
       FROM documents d
       LEFT JOIN users u ON d.verifiedBy = u.id
       WHERE d.userId = ?
       ORDER BY d.uploadedAt DESC`,
        [req.user.id],
      );

      res.json(documents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Obter todos os documentos pendentes
app.get(
  "/api/admin/documents",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { status = "pending" } = req.query;

      const [documents] = await pool.query(
        `SELECT d.*, u.firstName, u.lastName, u.email, u.phone
       FROM documents d
       JOIN users u ON d.userId = u.id
       WHERE d.status = ?
       ORDER BY d.uploadedAt DESC`,
        [status],
      );

      res.json(documents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Obter detalhes de um documento específico
app.get(
  "/api/admin/documents/:id",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const [documents] = await pool.query(
        `SELECT d.*, u.firstName, u.lastName, u.email, u.phone, u.biNumber,
              reviewer.firstName as reviewerFirstName, reviewer.lastName as reviewerLastName
       FROM documents d
       JOIN users u ON d.userId = u.id
       LEFT JOIN users reviewer ON d.verifiedBy = reviewer.id
       WHERE d.id = ?`,
        [req.params.id],
      );

      if (documents.length === 0) {
        return res.status(404).json({ error: "Documento não encontrado" });
      }

      res.json(documents[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Aprovar documento
app.put(
  "/api/admin/documents/:id/approve",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { adminNotes } = req.body;

      const [result] = await pool.query(
        `UPDATE documents
       SET status = 'verified', verifiedBy = ?, verifiedAt = NOW(), adminNotes = ?
       WHERE id = ?`,
        [req.user.id, adminNotes || null, req.params.id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Documento não encontrado" });
      }

      // Atualizar status de verificação do usuário
      const [doc] = await pool.query(
        "SELECT userId, documentType FROM documents WHERE id = ?",
        [req.params.id],
      );
      if (doc.length > 0) {
        const userId = doc[0].userId;
        const docType = doc[0].documentType;

        const statusMap = {
          bi: "biStatus",
          propertyTitle: "propertyTitleStatus",
          addressProof: "addressProofStatus",
        };

        if (statusMap[docType]) {
          await pool.query(
            `UPDATE document_verifications
           SET ${statusMap[docType]} = 'verified'
           WHERE userId = ?`,
            [userId],
          );
        }
      }

      res.json({ message: "Documento aprovado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Rejeitar documento
app.put(
  "/api/admin/documents/:id/reject",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { rejectionReason } = req.body;

      if (!rejectionReason) {
        return res
          .status(400)
          .json({ error: "Motivo da rejeição é obrigatório" });
      }

      const [result] = await pool.query(
        `UPDATE documents
       SET status = 'rejected', verifiedBy = ?, verifiedAt = NOW(), rejectionReason = ?
       WHERE id = ?`,
        [req.user.id, rejectionReason, req.params.id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Documento não encontrado" });
      }

      res.json({ message: "Documento rejeitado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// --- PROPERTIES ROUTES ---
app.get("/api/properties", async (req, res) => {
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
        biStatus: row.biStatus || "pending",
        propertyTitleStatus: row.propertyTitleStatus || "pending",
        verificationScore: Number(row.verificationScore || 0),
        isVerified: Boolean(row.isVerified || false),
      },
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/properties/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Imóvel não encontrado" });

    const [images] = await pool.query(
      "SELECT * FROM property_images WHERE propertyId = ?",
      [req.params.id],
    );
    const [verif] = await pool.query(
      "SELECT * FROM document_verifications dv JOIN users u ON dv.userId = u.id WHERE u.id = (SELECT landlordId FROM properties WHERE id = ?)",
      [req.params.id],
    );

    res.json({ ...rows[0], images, verification: verif[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(
  "/api/properties/publish",
  auth.authenticateToken,
  auth.authorizeRole(["landlord", "admin"]),
  async (req, res) => {
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
        featured = false,
      } = req.body;

      if (!title || !price || !location || !district || !type) {
        return res
          .status(400)
          .json({
            error:
              "Campos obrigatórios: title, price, location, district e type",
          });
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
          area !== null && area !== undefined && area !== ""
            ? Number(area)
            : null,
          Boolean(featured),
          req.user.id,
        ],
      );

      const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
        result.insertId,
      ]);
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Update Property (Price, Title, etc)
app.put(
  "/api/admin/properties/:id",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { title, description, price, featured, type } = req.body;
      await pool.query(
        "UPDATE properties SET title = ?, description = ?, price = ?, featured = ?, type = ? WHERE id = ?",
        [title, description, price, featured, type, req.params.id],
      );
      res.json({ message: "Imóvel atualizado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Admin: Update Verification Status
app.put(
  "/api/admin/verify/:userId",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { biStatus, propertyTitleStatus, isVerified, verificationScore } =
        req.body;
      await pool.query(
        "UPDATE document_verifications SET biStatus = ?, propertyTitleStatus = ?, isVerified = ?, verificationScore = ? WHERE userId = ?",
        [
          biStatus,
          propertyTitleStatus,
          isVerified,
          verificationScore,
          req.params.userId,
        ],
      );
      res.json({ message: "Status de verificação atualizado" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// --- FINANCIALS ROUTES ---
app.get(
  "/api/admin/financials",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const [revenue] = await pool.query(
        "SELECT SUM(monthlyRevenue) as total FROM property_financials",
      );
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
  },
);

// Error handler para multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Arquivo muito grande. Máximo 10MB" });
    }
  }
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Erro no servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
