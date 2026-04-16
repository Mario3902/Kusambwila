const { pool } = require('./db');
const auth = require('./auth');

async function createUserWithVerification(user) {
  const hashedPassword = await auth.hashPassword(user.password);
  const [result] = await pool.query(
    `INSERT INTO users (firstName, lastName, email, password, phone, userType, biNumber)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       firstName = VALUES(firstName),
       lastName = VALUES(lastName),
       password = VALUES(password),
       phone = VALUES(phone),
       userType = VALUES(userType),
       biNumber = VALUES(biNumber),
       updatedAt = CURRENT_TIMESTAMP`,
    [user.firstName, user.lastName, user.email, hashedPassword, user.phone, user.userType, user.biNumber || null]
  );

  const userId = result.insertId || (await pool.query('SELECT id FROM users WHERE email = ?', [user.email]))[0][0].id;

  await pool.query(
    `INSERT INTO document_verifications
    (userId, biStatus, propertyTitleStatus, addressProofStatus, verificationScore, isVerified)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      biStatus = VALUES(biStatus),
      propertyTitleStatus = VALUES(propertyTitleStatus),
      addressProofStatus = VALUES(addressProofStatus),
      verificationScore = VALUES(verificationScore),
      isVerified = VALUES(isVerified),
      updatedAt = CURRENT_TIMESTAMP`,
    [
      userId,
      user.verification.biStatus,
      user.verification.propertyTitleStatus,
      user.verification.addressProofStatus,
      user.verification.verificationScore,
      user.verification.isVerified
    ]
  );

  return userId;
}

async function seed() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // Make seed re-runnable without duplicate data.
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE property_financials');
    await pool.query('TRUNCATE TABLE price_history');
    await pool.query('TRUNCATE TABLE property_images');
    await pool.query('TRUNCATE TABLE property_amenities');
    await pool.query('TRUNCATE TABLE payments');
    await pool.query('TRUNCATE TABLE messages');
    await pool.query('TRUNCATE TABLE properties');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    const defaultAmenities = [
      'Piscina', 'Segurança 24h', 'Estacionamento', 'Ginásio', 'Jardim',
      'Garagem', 'Sistema Solar', 'Mobilado', 'Ar Condicionado', 'Internet',
      'Novo', 'Condomínio Fechado', 'Varanda', 'Piscina Infinity',
      'Home Cinema', 'Sistema Smart Home', 'Elevador Privado',
      'Localização Central', 'Elevador'
    ];

    for (const amenity of defaultAmenities) {
      await pool.query('INSERT IGNORE INTO amenities (name) VALUES (?)', [amenity]);
    }

    const users = [
      {
        firstName: 'Admin',
        lastName: 'Kusambwila',
        email: 'admin@kusambwila.ao',
        password: 'adminpassword123',
        phone: '+244900000000',
        userType: 'admin',
        verification: {
          biStatus: 'verified',
          propertyTitleStatus: 'verified',
          addressProofStatus: 'verified',
          verificationScore: 100,
          isVerified: 1
        }
      },
      {
        firstName: 'Maria',
        lastName: 'Costa',
        email: 'maria@test.com',
        password: 'pass123',
        phone: '+244923456001',
        userType: 'landlord',
        biNumber: '005412345LA048',
        verification: {
          biStatus: 'verified',
          propertyTitleStatus: 'verified',
          addressProofStatus: 'verified',
          verificationScore: 92,
          isVerified: 1
        }
      },
      {
        firstName: 'Carlos',
        lastName: 'Pereira',
        email: 'carlos@test.com',
        password: 'pass123',
        phone: '+244923456002',
        userType: 'landlord',
        biNumber: '005412346LA048',
        verification: {
          biStatus: 'verified',
          propertyTitleStatus: 'verified',
          addressProofStatus: 'verified',
          verificationScore: 89,
          isVerified: 1
        }
      },
      {
        firstName: 'Joana',
        lastName: 'Silva',
        email: 'joana@test.com',
        password: 'pass123',
        phone: '+244923456003',
        userType: 'tenant',
        verification: {
          biStatus: 'pending',
          propertyTitleStatus: 'pending',
          addressProofStatus: 'pending',
          verificationScore: 20,
          isVerified: 0
        }
      }
    ];

    const userIds = {};
    for (const user of users) {
      userIds[user.email] = await createUserWithVerification(user);
    }

    const properties = [
      {
        title: 'Apartamento T2 Moderno em Talatona',
        description: 'Apartamento com acabamentos premium e condomínio fechado.',
        price: 250000,
        location: 'Rua Principal de Talatona',
        district: 'Talatona',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 110,
        featured: 1,
        landlordEmail: 'maria@test.com',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'
        ],
        monthlyRevenue: 250000,
        occupancyRate: 95
      },
      {
        title: 'Moradia T3 com Jardim em Benfica',
        description: 'Moradia familiar com quintal amplo e garagem para 2 viaturas.',
        price: 320000,
        location: 'Avenida Central do Benfica',
        district: 'Benfica',
        type: 'house',
        bedrooms: 3,
        bathrooms: 3,
        area: 180,
        featured: 1,
        landlordEmail: 'carlos@test.com',
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
        ],
        monthlyRevenue: 320000,
        occupancyRate: 91
      },
      {
        title: 'Studio Mobilado no Kilamba',
        description: 'Studio ideal para jovem profissional, pronto para morar.',
        price: 120000,
        location: 'Bloco K, Centralidade do Kilamba',
        district: 'Kilamba',
        type: 'studio',
        bedrooms: 1,
        bathrooms: 1,
        area: 55,
        featured: 0,
        landlordEmail: 'maria@test.com',
        images: [
          'https://images.unsplash.com/photo-1493666438817-866a91353ca9'
        ],
        monthlyRevenue: 120000,
        occupancyRate: 88
      }
    ];

    for (const property of properties) {
      const [propertyResult] = await pool.query(
        `INSERT INTO properties
         (title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          property.title,
          property.description,
          property.price,
          property.location,
          property.district,
          property.type,
          property.bedrooms,
          property.bathrooms,
          property.area,
          property.featured,
          userIds[property.landlordEmail]
        ]
      );

      for (let i = 0; i < property.images.length; i++) {
        await pool.query(
          'INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, ?)',
          [propertyResult.insertId, property.images[i], i === 0 ? 1 : 0]
        );
      }

      const yearlyRevenue = property.monthlyRevenue * 12;
      const maintenanceCosts = Math.round(property.monthlyRevenue * 0.08);
      const netProfit = property.monthlyRevenue - maintenanceCosts;
      await pool.query(
        `INSERT INTO property_financials
         (propertyId, monthlyRevenue, yearlyRevenue, occupancyRate, totalTenants, maintenanceCosts, netProfit)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [propertyResult.insertId, property.monthlyRevenue, yearlyRevenue, property.occupancyRate, 1, maintenanceCosts, netProfit]
      );

      await pool.query(
        'INSERT INTO price_history (propertyId, price) VALUES (?, ?)',
        [propertyResult.insertId, property.price]
      );
    }

    console.log('Seed concluido com sucesso.');
    console.log('Credenciais seeded:');
    console.log('- admin@kusambwila.ao / adminpassword123');
    console.log('- maria@test.com / pass123');
    console.log('- carlos@test.com / pass123');
    console.log('- joana@test.com / pass123');
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();