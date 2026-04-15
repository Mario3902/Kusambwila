const { pool } = require('./db');
const auth = require('./auth');

async function seed() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // 1. Criar Administrador Padrão
    const adminEmail = 'admin@kusambwila.ao';
    const adminPassword = 'adminpassword123';
    
    const [userExists] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (userExists.length === 0) {
      console.log('Criando administrador padrão...');
      const hashedPassword = await auth.hashPassword(adminPassword);
      const [userResult] = await pool.query(
        `INSERT INTO users (firstName, lastName, email, password, phone, userType) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['Admin', 'Kusambwila', adminEmail, hashedPassword, '+244900000000', 'admin']
      );
      const adminId = userResult.insertId;
      
      await pool.query(
        `INSERT INTO document_verifications (userId, biStatus, propertyTitleStatus, addressProofStatus, verificationScore, isVerified) 
         VALUES (?, 'verified', 'verified', 'verified', 100, 1)`,
        [adminId]
      );
      console.log('Administrador criado: admin@kusambwila.ao / adminpassword123');
    } else {
      console.log('Administrador já existe.');
    }

    // 2. Inserir Amenidades Padrão
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
    console.log('Amenidades inseridas.');

    // 3. Inserir alguns proprietários e imóveis de teste
    const landlords = [
      { first: 'Maria', last: 'Costa', email: 'maria@test.com', pass: 'pass123', type: 'landlord' },
      { first: 'Carlos', last: 'Pereira', email: 'carlos@test.com', pass: 'pass123', type: 'landlord' }
    ];

    for (const l of landlords) {
      const [lResult] = await pool.query(
        `INSERT IGNORE INTO users (firstName, lastName, email, password, userType) VALUES (?, ?, ?, ?, ?)`,
        [l.first, l.last, l.email, await auth.hashPassword(l.pass), l.type]
      );
      
      // Se o usuário foi inserido agora ou já existia, pegamos o ID
      const [userData] = await pool.query('SELECT id FROM users WHERE email = ?', [l.email]);
      const userId = userData[0].id;

      await pool.query(
        `INSERT IGNORE INTO document_verifications (userId, biStatus, propertyTitleStatus, addressProofStatus, verificationScore, isVerified) 
         VALUES (?, 'verified', 'verified', 'verified', 90, 1)`,
        [userId]
      );
    }

    console.log('Seed concluído com sucesso!');
  } catch (err) {
    console.error('Erro no seed:', err);
  } finally {
    process.exit();
  }
}

seed();