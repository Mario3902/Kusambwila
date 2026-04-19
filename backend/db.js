const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    console.log("Conectando ao MySQL para inicializar tabelas...");

    // Tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        userType ENUM('tenant', 'landlord', 'admin') NOT NULL,
        biNumber VARCHAR(100),
        biDocument VARCHAR(255),
        propertyDocument VARCHAR(255),
        avatar VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabela de propriedades
    await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        district VARCHAR(100) NOT NULL,
        type ENUM('apartment', 'house', 'villa', 'studio', 'commercial') NOT NULL,
        bedrooms INT DEFAULT 0,
        bathrooms INT DEFAULT 0,
        area INT,
        featured BOOLEAN DEFAULT FALSE,
        landlordId INT,
        latitude DOUBLE,
        longitude DOUBLE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (landlordId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Tabela de imagens de propriedades
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        isPrimary BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Tabela de amenidades
    await connection.query(`
      CREATE TABLE IF NOT EXISTS amenities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);

    // Tabela de propriedades_amenidades
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_amenities (
        propertyId INT,
        amenityId INT,
        PRIMARY KEY (propertyId, amenityId),
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (amenityId) REFERENCES amenities(id) ON DELETE CASCADE
      )
    `);

    // Tabela de verificação de documentos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS document_verifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT UNIQUE,
        biStatus ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        biVerifiedAt DATETIME,
        propertyTitleStatus ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        propertyTitleVerifiedAt DATETIME,
        addressProofStatus ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        verificationScore INT DEFAULT 0,
        isVerified BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de documentos submetidos pelos proprietários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        documentType ENUM('bi', 'propertyTitle', 'addressProof') NOT NULL,
        fileName VARCHAR(255) NOT NULL,
        filePath VARCHAR(255) NOT NULL,
        fileSize INT,
        mimeType VARCHAR(100),
        status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        rejectionReason TEXT,
        uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verifiedAt DATETIME,
        verifiedBy INT,
        adminNotes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (verifiedBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Tabela de dados financeiros
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_financials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT UNIQUE,
        monthlyRevenue INT DEFAULT 0,
        yearlyRevenue INT DEFAULT 0,
        occupancyRate FLOAT DEFAULT 0,
        totalTenants INT DEFAULT 0,
        maintenanceCosts INT DEFAULT 0,
        netProfit INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Tabela de histórico de preços
    await connection.query(`
      CREATE TABLE IF NOT EXISTS price_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT NOT NULL,
        price INT NOT NULL,
        recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Tabela de pagamentos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT NOT NULL,
        tenantName VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        paymentDate DATETIME NOT NULL,
        status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
        method ENUM('transfer', 'cash', 'multicaixa') DEFAULT 'transfer',
        reference VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Tabela de mensagens
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        propertyId INT,
        content TEXT NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (receiverId) REFERENCES users(id),
        FOREIGN KEY (propertyId) REFERENCES properties(id)
      )
    `);

    console.log("Banco de dados MySQL inicializado com sucesso.");
  } catch (err) {
    console.error("Erro ao inicializar banco de dados:", err);
  } finally {
    connection.release();
  }
}

module.exports = { pool, initializeDatabase };
