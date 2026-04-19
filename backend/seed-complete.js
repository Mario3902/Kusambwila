/**
 * Script de Seed Completo para Kusambwila
 * Popula o banco de dados com múltiplas propriedades por utilizador e região
 * Execute: node backend/seed-complete.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Dados de propriedades organizadas por região e proprietário
const propriedades = [
  // ============ CACUACO - MARIA COSTA ============
  {
    landlordId: 2,
    titulo: 'Casa T3 Moderna em Cacuaco',
    descricao: 'Moradia moderna com 3 quartos, 2 casas de banho, cozinha equipada, sala de estar ampla, quintal com garagem. Segurança 24h, rede de água e eletricidade',
    preco: 180000,
    localizacao: 'Rua A, Cacuaco',
    distrito: 'Cacuaco',
    tipo: 'house',
    quartos: 3,
    casas_banho: 2,
    area: 150,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ]
  },
  {
    landlordId: 2,
    titulo: 'Apartamento T2 em Cacuaco',
    descricao: 'Apartamento confortável com 2 quartos, 1 casa de banho, cozinha completa, varanda com vista. Localizado em zona calma e segura.',
    preco: 95000,
    localizacao: 'Avenida Principal, Cacuaco',
    distrito: 'Cacuaco',
    tipo: 'apartment',
    quartos: 2,
    casas_banho: 1,
    area: 85,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800'
    ]
  },
  {
    landlordId: 2,
    titulo: 'Vila Luxuosa em Cacuaco',
    descricao: 'Vila de luxo com 5 quartos, 3 casas de banho, piscina, jardim amplo, garagem para 3 viaturas. Acabamentos premium em toda a casa.',
    preco: 450000,
    localizacao: 'Zona Residencial Premium, Cacuaco',
    distrito: 'Cacuaco',
    tipo: 'villa',
    quartos: 5,
    casas_banho: 3,
    area: 280,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
    ]
  },

  // ============ BENFICA - CARLOS PEREIRA ============
  {
    landlordId: 3,
    titulo: 'Moradia T4 em Benfica',
    descricao: 'Moradia espaçosa com 4 quartos, 2 casas de banho, cozinha moderna, sala de jantar e de estar, varanda com vista para a rua. Perto de escolas e comércio.',
    preco: 280000,
    localizacao: 'Avenida Marginal, Benfica',
    distrito: 'Benfica',
    tipo: 'house',
    quartos: 4,
    casas_banho: 2,
    area: 200,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ]
  },
  {
    landlordId: 3,
    titulo: 'Apartamento Premium em Benfica',
    descricao: 'Apartamento sofisticado com 3 quartos, 2 casas de banho, sala ampla com varanda vista mar, cozinha equipada, estacionamento subterrâneo.',
    preco: 220000,
    localizacao: 'Praia de Benfica, Benfica',
    distrito: 'Benfica',
    tipo: 'apartment',
    quartos: 3,
    casas_banho: 2,
    area: 140,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ]
  },
  {
    landlordId: 3,
    titulo: 'Studio Moderno em Benfica',
    descricao: 'Studio perfeito para profissional jovem ou casal. Com quarto integrado, cozinha aberta, casa de banho moderna. Prédio com piscina e ginásio.',
    preco: 85000,
    localizacao: 'Centro Comercial, Benfica',
    distrito: 'Benfica',
    tipo: 'studio',
    quartos: 1,
    casas_banho: 1,
    area: 55,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800'
    ]
  },

  // ============ TALATONA - MARIA COSTA ============
  {
    landlordId: 2,
    titulo: 'Casa T3 em Talatona',
    descricao: 'Casa aconchegante em zona tranquila de Talatona. 3 quartos, 2 casas de banho, cozinha completa, sala espaçosa, varanda com jardim.',
    preco: 200000,
    localizacao: 'Rua do Comércio, Talatona',
    distrito: 'Talatona',
    tipo: 'house',
    quartos: 3,
    casas_banho: 2,
    area: 160,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1570129477492-45a003706e23?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ]
  },
  {
    landlordId: 2,
    titulo: 'Apartamento T2 com Varanda em Talatona',
    descricao: 'Apartamento prático com 2 quartos, 1 casa de banho, cozinha equipada, varanda com vista panorâmica. Condomínio fechado com segurança.',
    preco: 120000,
    localizacao: 'Centralidade de Talatona, Talatona',
    distrito: 'Talatona',
    tipo: 'apartment',
    quartos: 2,
    casas_banho: 1,
    area: 90,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800'
    ]
  },

  // ============ KILAMBA - CARLOS PEREIRA ============
  {
    landlordId: 3,
    titulo: 'Vila Espaçosa em Kilamba',
    descricao: 'Vila moderna e espaçosa com 4 quartos, 3 casas de banho, piscina, jardim amplo, garagem. Localização privilegiada em zona residencial premium.',
    preco: 380000,
    localizacao: 'Bloco Centralidade, Kilamba',
    distrito: 'Kilamba',
    tipo: 'villa',
    quartos: 4,
    casas_banho: 3,
    area: 250,
    destaque: 1,
    imagens: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
    ]
  },
  {
    landlordId: 3,
    titulo: 'Apartamento T3 em Kilamba',
    descricao: 'Apartamento confortável no coração do Kilamba. 3 quartos, 2 casas de banho, cozinha moderna, sala com varanda. Perto de tudo.',
    preco: 140000,
    localizacao: 'Bloco K, Kilamba',
    distrito: 'Kilamba',
    tipo: 'apartment',
    quartos: 3,
    casas_banho: 2,
    area: 120,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ]
  },
  {
    landlordId: 3,
    titulo: 'Studio Acessível em Kilamba',
    descricao: 'Studio ideal para quem procura algo acessível e bem localizado. Quarto integrado, cozinha completa, casa de banho. Edifício com portaria.',
    preco: 75000,
    localizacao: 'Rua Principal, Kilamba',
    distrito: 'Kilamba',
    tipo: 'studio',
    quartos: 1,
    casas_banho: 1,
    area: 50,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800'
    ]
  },

  // ============ MACA - MARIA COSTA ============
  {
    landlordId: 2,
    titulo: 'Casa Comercial em Maca',
    descricao: 'Propriedade comercial em zona de alto fluxo. Ideal para loja, consultório, escritório. 2 pisos, 250m2 úteis, fachada moderna.',
    preco: 320000,
    localizacao: 'Centro Comercial de Maca, Maca',
    distrito: 'Maca',
    tipo: 'commercial',
    quartos: 0,
    casas_banho: 2,
    area: 250,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1554195586-5b5e7e49b5d5?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ]
  },
  {
    landlordId: 2,
    titulo: 'Moradia T2 em Maca',
    descricao: 'Moradia discreta com 2 quartos, 1 casa de banho, cozinha, sala. Zona calma perto de transportes e comércio.',
    preco: 110000,
    localizacao: 'Rua Lateral, Maca',
    distrito: 'Maca',
    tipo: 'house',
    quartos: 2,
    casas_banho: 1,
    area: 100,
    destaque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1570129477492-45a003706e23?w=800'
    ]
  }
];

async function seedDatabase() {
  let connection;

  try {
    console.log('\n🚀 Iniciando população completa do banco de dados...\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kusambwila_db'
    });

    console.log('✅ Conectado ao banco de dados\n');

    // Verificar quantas propriedades já existem
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM properties');
    const propertiesExistentes = existing[0].count;
    console.log(`📊 Propriedades existentes: ${propertiesExistentes}\n`);

    // Inserir propriedades
    console.log('📋 Inserindo propriedades...\n');

    let contador = 0;
    let totalImagens = 0;

    for (const prop of propriedades) {
      const [result] = await connection.query(
        `INSERT INTO properties
         (title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prop.titulo,
          prop.descricao,
          prop.preco,
          prop.localizacao,
          prop.distrito,
          prop.tipo,
          prop.quartos,
          prop.casas_banho,
          prop.area,
          prop.destaque,
          prop.landlordId
        ]
      );

      const propertyId = result.insertId;
      console.log(`  ✅ ${prop.titulo} (${prop.distrito}) - ${prop.preco.toLocaleString('pt-AO')} Kz`);

      // Inserir imagens
      for (let i = 0; i < prop.imagens.length; i++) {
        await connection.query(
          `INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, ?)`,
          [propertyId, prop.imagens[i], i === 0 ? 1 : 0]
        );
        totalImagens++;
      }

      // Inserir dados financeiros
      const receita = Math.floor(prop.preco * 0.5);
      const receitaAnual = receita * 12;
      const ocupacao = Math.random() * (95 - 70) + 70;
      const manutencao = Math.floor(prop.preco * 0.05);
      const lucro = Math.floor(prop.preco * 0.4);

      await connection.query(
        `INSERT INTO property_financials
         (propertyId, monthlyRevenue, yearlyRevenue, occupancyRate, totalTenants, maintenanceCosts, netProfit)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          propertyId,
          receita,
          receitaAnual,
          ocupacao,
          1,
          manutencao,
          lucro
        ]
      );

      contador++;
    }

    console.log(`\n✅ ${contador} propriedades inseridas com sucesso!`);
    console.log(`✅ ${totalImagens} imagens inseridas!\n`);

    // Estatísticas por região
    console.log('📊 Estatísticas por Região:\n');
    const [stats] = await connection.query(
      `SELECT district, COUNT(*) as count, AVG(price) as media_preco, MAX(price) as preco_max, MIN(price) as preco_min
       FROM properties
       GROUP BY district
       ORDER BY count DESC`
    );

    for (const stat of stats) {
      console.log(`  ${stat.district}:`);
      console.log(`    • Propriedades: ${stat.count}`);
      console.log(`    • Preço médio: ${Math.floor(stat.media_preco).toLocaleString('pt-AO')} Kz`);
      console.log(`    • Preço máximo: ${Math.floor(stat.preco_max).toLocaleString('pt-AO')} Kz`);
      console.log(`    • Preço mínimo: ${Math.floor(stat.preco_min).toLocaleString('pt-AO')} Kz\n`);
    }

    // Estatísticas por proprietário
    console.log('👥 Estatísticas por Proprietário:\n');
    const [landlordStats] = await connection.query(
      `SELECT u.firstName, u.lastName, COUNT(p.id) as count, AVG(p.price) as media_preco, SUM(pf.monthlyRevenue) as receita_total
       FROM users u
       LEFT JOIN properties p ON u.id = p.landlordId
       LEFT JOIN property_financials pf ON p.id = pf.propertyId
       WHERE u.userType = 'landlord'
       GROUP BY u.id
       ORDER BY count DESC`
    );

    for (const stat of landlordStats) {
      if (stat.count > 0) {
        console.log(`  ${stat.firstName} ${stat.lastName}:`);
        console.log(`    • Propriedades: ${stat.count}`);
        console.log(`    • Preço médio: ${Math.floor(stat.media_preco).toLocaleString('pt-AO')} Kz`);
        console.log(`    • Receita mensal total: ${Math.floor(stat.receita_total).toLocaleString('pt-AO')} Kz\n`);
      }
    }

    // Tipos de propriedade
    console.log('🏠 Estatísticas por Tipo de Propriedade:\n');
    const [typeStats] = await connection.query(
      `SELECT type, COUNT(*) as count, AVG(price) as media_preco
       FROM properties
       GROUP BY type
       ORDER BY count DESC`
    );

    for (const stat of typeStats) {
      console.log(`  ${stat.type}: ${stat.count} propriedade(s) | Preço médio: ${Math.floor(stat.media_preco).toLocaleString('pt-AO')} Kz`);
    }

    // Total geral
    const [total] = await connection.query('SELECT COUNT(*) as count FROM properties');
    const [totalReceita] = await connection.query('SELECT SUM(monthlyRevenue) as total FROM property_financials');

    console.log('\n════════════════════════════════════════════════════════');
    console.log('✅ BANCO DE DADOS POPULADO COM SUCESSO!');
    console.log('════════════════════════════════════════════════════════\n');

    console.log(`📊 Resumo Final:`);
    console.log(`  • Total de propriedades: ${total[0].count}`);
    console.log(`  • Total de imagens: ${totalImagens}`);
    console.log(`  • Receita mensal total: ${Math.floor(totalReceita[0].total).toLocaleString('pt-AO')} Kz`);
    console.log(`  • Regiões: 5 (Cacuaco, Benfica, Talatona, Kilamba, Maca)`);
    console.log(`  • Proprietários: 2 (Maria Costa, Carlos Pereira)\n`);

    console.log('🌍 Distribuição por Região:');
    console.log('  • Cacuaco: 3 propriedades (Maria)');
    console.log('  • Benfica: 3 propriedades (Carlos)');
    console.log('  • Talatona: 2 propriedades (Maria)');
    console.log('  • Kilamba: 3 propriedades (Carlos)');
    console.log('  • Maca: 2 propriedades (Maria)\n');

    console.log('════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('\nDica: Certifique-se de que:');
    console.error('  1. MySQL está instalado e rodando');
    console.error('  2. Backend/setup-db.js foi executado');
    console.error('  3. .env está configurado corretamente');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar seed
seedDatabase();
