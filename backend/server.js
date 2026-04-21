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

    const [allImages] = await pool.query("SELECT * FROM property_images");
    
    const propertiesWithImages = rows.map(row => {
      const propertyImages = allImages.filter(img => img.propertyId === row.id);
      const finalObj = {
        ...row,
        images: propertyImages,
        verification: {
          biStatus: row.biStatus || "pending",
          propertyTitleStatus: row.propertyTitleStatus || "pending",
          verificationScore: Number(row.verificationScore || 0),
          isVerified: Boolean(row.isVerified || false),
        },
      };
      return finalObj;
    });

    const result = propertiesWithImages;
    if (result.length > 0) {
      result[0].DEBUG_TEST = "THIS_IS_A_TEST";
    }
    res.json(result);
  } catch (err) {
    console.error("Error:", err);
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

// --- ADMIN USERS ROUTES ---
app.get(
  "/api/admin/users",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const [users] = await pool.query(
        `SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.userType, 
                u.biNumber, u.createdAt, u.updatedAt,
                dv.biStatus, dv.propertyTitleStatus, dv.addressProofStatus, 
                dv.verificationScore, dv.isVerified,
                (SELECT COUNT(*) FROM documents WHERE userId = u.id AND status = 'pending') as pendingDocuments
         FROM users u
         LEFT JOIN document_verifications dv ON u.id = dv.userId
         ORDER BY u.createdAt DESC`
      );
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: Get Single User Details
app.get(
  "/api/admin/users/:id",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const [users] = await pool.query(
        `SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.userType, 
                u.biNumber, u.createdAt, u.updatedAt,
                dv.biStatus, dv.propertyTitleStatus, dv.addressProofStatus, 
                dv.verificationScore, dv.isVerified
         FROM users u
         LEFT JOIN document_verifications dv ON u.id = dv.userId
         WHERE u.id = ?`,
        [req.params.id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }
      
      // Get user's documents
      const [documents] = await pool.query(
        `SELECT d.*, reviewer.firstName as reviewerFirstName, reviewer.lastName as reviewerLastName
         FROM documents d
         LEFT JOIN users reviewer ON d.verifiedBy = reviewer.id
         WHERE d.userId = ?
         ORDER BY d.uploadedAt DESC`,
        [req.params.id]
      );
      
      res.json({ ...users[0], documents });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: Delete Property
app.delete(
  "/api/admin/properties/:id",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      // First delete related images
      await pool.query("DELETE FROM property_images WHERE propertyId = ?", [req.params.id]);
      
      // Then delete property financials if exists
      await pool.query("DELETE FROM property_financials WHERE propertyId = ?", [req.params.id]);
      
      // Finally delete the property
      const [result] = await pool.query("DELETE FROM properties WHERE id = ?", [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }
      
      res.json({ message: "Imóvel removido com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: Get Dashboard Stats
app.get(
  "/api/admin/stats",
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const [userStats] = await pool.query(
        "SELECT COUNT(*) as total, SUM(CASE WHEN userType = 'landlord' THEN 1 ELSE 0 END) as landlords FROM users"
      );
      const [propertyStats] = await pool.query("SELECT COUNT(*) as total FROM properties");
      const [pendingDocs] = await pool.query(
        "SELECT COUNT(*) as total FROM documents WHERE status = 'pending'"
      );
      const [revenue] = await pool.query(
        "SELECT SUM(monthlyRevenue) as total FROM property_financials"
      );
      
      res.json({
        totalUsers: userStats[0].total,
        totalLandlords: userStats[0].landlords,
        totalProperties: propertyStats[0].total,
        pendingDocuments: pendingDocs[0].total,
        totalRevenue: revenue[0].total || 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
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

// --- FAVORITES ROUTES (Carrinho do Inquilino) ---

// Get user favorites
app.get(
  "/api/favorites",
  auth.authenticateToken,
  async (req, res) => {
    try {
      const [favorites] = await pool.query(
        `SELECT f.*, p.title, p.price, p.district, p.type, p.bedrooms, p.bathrooms, p.area, p.status,
                u.firstName as landlordFirstName, u.lastName as landlordLastName,
                (SELECT url FROM property_images WHERE propertyId = p.id AND isPrimary = TRUE LIMIT 1) as imageUrl
         FROM favorites f
         JOIN properties p ON f.propertyId = p.id
         JOIN users u ON p.landlordId = u.id
         WHERE f.userId = ?
         ORDER BY f.createdAt DESC`,
        [req.user.id]
      );
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Add to favorites
app.post(
  "/api/favorites",
  auth.authenticateToken,
  async (req, res) => {
    try {
      const { propertyId, notes } = req.body;
      
      await pool.query(
        "INSERT INTO favorites (userId, propertyId, notes) VALUES (?, ?, ?)",
        [req.user.id, propertyId, notes || null]
      );
      
      res.status(201).json({ message: "Adicionado aos favoritos" });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Imóvel já está nos favoritos" });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

// Remove from favorites
app.delete(
  "/api/favorites/:propertyId",
  auth.authenticateToken,
  async (req, res) => {
    try {
      await pool.query(
        "DELETE FROM favorites WHERE userId = ? AND propertyId = ?",
        [req.user.id, req.params.propertyId]
      );
      res.json({ message: "Removido dos favoritos" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// --- PROPERTY STATUS ROUTES (Para Proprietários) ---

// Update property status (available, rented, inactive)
app.put(
  "/api/properties/:id/status",
  auth.authenticateToken,
  auth.authorizeRole(["landlord", "admin"]),
  async (req, res) => {
    try {
      const { status } = req.body; // 'available', 'rented', 'inactive'
      
      // Verify property belongs to user (unless admin)
      if (req.user.userType !== 'admin') {
        const [properties] = await pool.query(
          "SELECT landlordId FROM properties WHERE id = ?",
          [req.params.id]
        );
        if (properties.length === 0) {
          return res.status(404).json({ error: "Imóvel não encontrado" });
        }
        if (properties[0].landlordId !== req.user.id) {
          return res.status(403).json({ error: "Não autorizado" });
        }
      }
      
      const rentedAt = status === 'rented' ? new Date() : null;
      
      await pool.query(
        "UPDATE properties SET status = ?, rentedAt = ? WHERE id = ?",
        [status, rentedAt, req.params.id]
      );
      
      res.json({ message: `Imóvel marcado como ${status}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get my properties with status (for landlords)
app.get(
  "/api/my-properties",
  auth.authenticateToken,
  auth.authorizeRole(["landlord"]),
  async (req, res) => {
    try {
      const [properties] = await pool.query(
        `SELECT p.*, 
                (SELECT url FROM property_images WHERE propertyId = p.id AND isPrimary = TRUE LIMIT 1) as imageUrl,
                (SELECT COUNT(*) FROM favorites WHERE propertyId = p.id) as favoritesCount
         FROM properties p
         WHERE p.landlordId = ?
         ORDER BY p.createdAt DESC`,
        [req.user.id]
      );
      res.json(properties);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
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
