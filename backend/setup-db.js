const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  let connection;
  try {
    // Conectar ao MySQL sem base de dados especificada
    console.log("🔄 Conectando ao MySQL...");
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    console.log("✅ Conectado ao MySQL");

    // Criar base de dados
    console.log("🔄 Criando base de dados...");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "kusambwila_db"}
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
    console.log("✅ Base de dados criada");

    // Selecionar base de dados
    await connection.query(`USE ${process.env.DB_NAME || "kusambwila_db"}`);

    // Criar tabelas
    console.log("🔄 Criando tabelas...");

    // Tabela users
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
    console.log("  ✅ Tabela users criada");

    // Tabela properties
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
    console.log("  ✅ Tabela properties criada");

    // Tabela property_images
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
    console.log("  ✅ Tabela property_images criada");

    // Tabela amenities
    await connection.query(`
      CREATE TABLE IF NOT EXISTS amenities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log("  ✅ Tabela amenities criada");

    // Tabela property_amenities
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_amenities (
        propertyId INT,
        amenityId INT,
        PRIMARY KEY (propertyId, amenityId),
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (amenityId) REFERENCES amenities(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ Tabela property_amenities criada");

    // Tabela document_verifications
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
    console.log("  ✅ Tabela document_verifications criada");

    // Tabela documents (NOVA - para upload de documentos)
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
        FOREIGN KEY (verifiedBy) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_userId (userId),
        INDEX idx_status (status),
        INDEX idx_uploadedAt (uploadedAt)
      )
    `);
    console.log("  ✅ Tabela documents criada");

    // Tabela property_financials
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
    console.log("  ✅ Tabela property_financials criada");

    // Tabela price_history
    await connection.query(`
      CREATE TABLE IF NOT EXISTS price_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT NOT NULL,
        price INT NOT NULL,
        recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ Tabela price_history criada");

    // Tabela payments
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
    console.log("  ✅ Tabela payments criada");

    // Tabela messages
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
    console.log("  ✅ Tabela messages criada");

    console.log("✅ Todas as tabelas criadas");

    // Inserir dados de teste
    console.log("🔄 Inserindo dados de teste...");

    // Verificar se já existem dados
    const [users] = await connection.query(
      "SELECT COUNT(*) as count FROM users",
    );
    if (users[0].count === 0) {
      await connection.query(`
        INSERT INTO users (id, firstName, lastName, email, password, phone, userType, biNumber) VALUES
        (1, 'Admin', 'Kusambwila', 'admin@kusambwila.ao', '$2b$12$77vAxeIZdD46NzgKl0WmZ.OadU23vsJxHTgs9lML0eoWNAf4B.QWu', '+244900000000', 'admin', NULL),
        (2, 'Maria', 'Costa', 'maria@test.com', '$2b$12$dExC6ccQIY0gURpCJEDsAOS5hnCNXcO4Avtw0V6/z5OzJ1Nm9oeJu', '+244923456001', 'landlord', '005412345LA048'),
        (3, 'Carlos', 'Pereira', 'carlos@test.com', '$2b$12$oyhuo.OM1HHq8RfcSfVAg.TKzxMUIaMmbfDXf2qAzvKFRsUEQmrwK', '+244923456002', 'landlord', '005412346LA048'),
        (4, 'Joana', 'Silva', 'joana@test.com', '$2b$12$NtB7qVdhHXfatZL6nS/hHuYOIbmtzC.8fex0JOBslZ8KOQQ6XCiOa', '+244923456003', 'tenant', NULL)
      `);
      console.log("  ✅ Utilizadores inseridos");

      await connection.query(`
        INSERT INTO document_verifications (id, userId, biStatus, propertyTitleStatus, addressProofStatus, verificationScore, isVerified) VALUES
        (1, 1, 'verified', 'verified', 'verified', 100, 1),
        (2, 2, 'pending', 'pending', 'pending', 0, 0),
        (3, 3, 'pending', 'pending', 'pending', 0, 0),
        (4, 4, 'pending', 'pending', 'pending', 0, 0)
      `);
      console.log("  ✅ Verificações de documentos inseridas");

      await connection.query(`
        INSERT INTO properties (id, title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId) VALUES
        (1, 'Apartamento T2 Moderno em Talatona', 'Apartamento com acabamentos premium e condomínio fechado.', 250000, 'Rua Principal de Talatona', 'Talatona', 'apartment', 2, 2, 110, 1, 2),
        (2, 'Moradia T3 com Jardim em Benfica', 'Moradia familiar com quintal amplo e garagem para 2 viaturas.', 320000, 'Avenida Central do Benfica', 'Benfica', 'house', 3, 3, 180, 1, 3),
        (3, 'Studio Mobilado no Kilamba', 'Studio ideal para jovem profissional, pronto para morar.', 120000, 'Bloco K, Centralidade do Kilamba', 'Kilamba', 'studio', 1, 1, 55, 0, 2)
      `);
      console.log("  ✅ Propriedades inseridas");

      await connection.query(`
        INSERT INTO property_images (id, propertyId, url, isPrimary) VALUES
        (1, 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 1),
        (2, 1, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 0),
        (3, 2, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', 1),
        (4, 2, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 0),
        (5, 3, 'https://images.unsplash.com/photo-1493666438817-866a91353ca9', 1)
      `);
      console.log("  ✅ Imagens de propriedades inseridas");

      await connection.query(`
        INSERT INTO property_financials (id, propertyId, monthlyRevenue, yearlyRevenue, occupancyRate, totalTenants, maintenanceCosts, netProfit) VALUES
        (1, 1, 250000, 3000000, 95, 1, 20000, 230000),
        (2, 2, 320000, 3840000, 91, 1, 25600, 294400),
        (3, 3, 120000, 1440000, 88, 1, 9600, 110400)
      `);
      console.log("  ✅ Dados financeiros inseridos");

      await connection.query(`
        INSERT INTO price_history (id, propertyId, price) VALUES
        (1, 1, 250000),
        (2, 2, 320000),
        (3, 3, 120000)
      `);
      console.log("  ✅ Histórico de preços inserido");

      await connection.query(`
        INSERT INTO amenities (id, name) VALUES
        (1, 'Piscina'),
        (2, 'Segurança 24h'),
        (3, 'Estacionamento'),
        (4, 'Ginásio'),
        (5, 'Jardim'),
        (6, 'Garagem'),
        (7, 'Sistema Solar'),
        (8, 'Mobilado'),
        (9, 'Ar Condicionado'),
        (10, 'Internet'),
        (11, 'Novo'),
        (12, 'Condomínio Fechado'),
        (13, 'Varanda'),
        (14, 'Piscina Infinity'),
        (15, 'Home Cinema'),
        (16, 'Sistema Smart Home'),
        (17, 'Elevador Privado'),
        (18, 'Localização Central'),
        (19, 'Elevador')
      `);
      console.log("  ✅ Amenidades inseridas");

      console.log("✅ Dados de teste inseridos");
    } else {
      console.log("ℹ️  Dados de teste já existem, pulando inserção");
    }

    console.log("\n");
    console.log("════════════════════════════════════════════════════════");
    console.log("✅ DATABASE SETUP COMPLETO COM SUCESSO!");
    console.log("════════════════════════════════════════════════════════");
    console.log("");
    console.log("📊 Estatísticas:");
    console.log("  • Base de dados: kusambwila_db");
    console.log("  • Tabelas criadas: 11");
    console.log("  • Utilizadores de teste: 4");
    console.log("  • Propriedades de exemplo: 3");
    console.log("");
    console.log("🔑 Credenciais de Teste:");
    console.log("  Admin:       admin@kusambwila.ao / adminpassword123");
    console.log("  Proprietário: maria@test.com / pass123");
    console.log("  Proprietário: carlos@test.com / pass123");
    console.log("  Inquilino:   joana@test.com / pass123");
    console.log("");
    console.log("🚀 Próximos passos:");
    console.log("  1. npm run dev (inicia o backend)");
    console.log("  2. Frontend: npm run dev");
    console.log("  3. Abra: http://localhost:5173");
    console.log("");
    console.log("════════════════════════════════════════════════════════");

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:", error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

// Executar setup
setupDatabase();
