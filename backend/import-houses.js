const { pool, initializeDatabase } = require('./db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const baseDir = 'C:/Users/dell/Downloads/Kusambwila website design';
const PROPERTIES_ROOT = baseDir + '/casas de alugar';

// Mapeamento de distritos
const districtMap = {
  'Alvalade': 'Alvalade',
  'Benfica': 'Benfica', 
  'Cacuaco': 'Cacuaco',
  'ingombota': 'Ingombota',
  'Kilamba': 'Kilamba',
  'Maianga': 'Maianga',
  'Miramar': 'Miramar',
  'Talatona': 'Talatona',
  'viana': 'Viana'
};

function extractPrice(text) {
  const priceMatch = text.match(/(\d{1,3}(?:\.\d{3})*)\s*Kz/i);
  if (priceMatch) {
    return parseInt(priceMatch[1].replace(/\./g, ''));
  }
  // Try any number pattern
  const numMatch = text.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : 0;
}

function extractBedrooms(text) {
  const match = text.match(/Quartos[\s\t]*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

function extractBathrooms(text) {
  const match = text.match(/Casas de Banho[\s\t]*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

function extractTitle(text) {
  const match = text.match(/Título do Anúncio[^\n]*(.+)/i);
  if (match) return match[1].trim().substring(0, 200);
  return 'Imóvel para Arrendamento';
}

function extractDescription(text) {
  const match = text.match(/Descrição[\s\t]*([^\n]+)/i);
  return match ? match[1].trim() : 'Descrição não disponível';
}

function extractAmenities(text) {
  const match = text.match(/Comodidades[^\n]*(.+)/i);
  if (match) {
    return match[1].split(',').map(a => a.trim());
  }
  return [];
}

function mapPropertyType(folderName) {
  const name = folderName.toLowerCase();
  if (name.includes('casa t3') || name.includes('casa t2')) return 'house';
  if (name.includes('apartamento') || name.includes('t1') || name.includes('t2')) return 'apartment';
  if (name.includes('comercial')) return 'commercial';
  if (name.includes('villa')) return 'villa';
  if (name.includes('studio')) return 'studio';
  return 'apartment';
}

function getImages(folderPath) {
  const supportedExt = ['.jpg', '.jpeg', '.png', '.webp'];
  try {
    return fs.readdirSync(folderPath)
      .filter(f => supportedExt.includes(path.extname(f).toLowerCase()))
      .map(f => path.join(folderPath, f));
  } catch {
    return [];
  }
}

async function importProperties() {
  console.log('🔄 Iniciando importação de propriedades...\n');
  
  const rootPath = PROPERTIES_ROOT;
  
  // Verificar se pasta existe
  if (!fs.existsSync(rootPath)) {
    console.error('❌ Pasta não encontrada:', rootPath);
    process.exit(1);
  }

  const regions = fs.readdirSync(rootPath);
  
  const allProperties = [];
  
  for (const region of regions) {
    const regionPath = path.join(rootPath, region);
    if (!fs.statSync(regionPath).isDirectory()) continue;
    
    const district = districtMap[region] || region;
    
    const propertyFolders = fs.readdirSync(regionPath);
    
    for (const folder of propertyFolders) {
      const folderPath = path.join(regionPath, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;
      
      // Ler arquivo de descrição
      const descFiles = fs.readdirSync(folderPath).filter(f => 
        f.toLowerCase().includes('descri')
      );
      
      if (descFiles.length === 0) {
        console.log(`⚠️  Sem descrição: ${region}/${folder}`);
        continue;
      }
      
      const descPath = path.join(folderPath, descFiles[0]);
      const descContent = fs.readFileSync(descPath, 'utf-8');
      
      // Extrair dados
      const title = extractTitle(descContent);
      const description = extractDescription(descContent);
      const price = extractPrice(descContent);
      const bedrooms = extractBedrooms(descContent);
      const bathrooms = extractBathrooms(descContent);
      const amenities = extractAmenities(descContent);
      const type = mapPropertyType(folder);
      const images = getImages(folderPath);
      
      allProperties.push({
        title,
        description,
        price,
        type,
        district,
        bedrooms,
        bathrooms,
        amenities,
        location: `${district}, Luanda`,
        images,
        region,
        folder
      });
      
      console.log(`✓ ${district}/${folder}: ${price} Kz`);
    }
  }

  console.log(`\n📊 Total de propriedades encontradas: ${allProperties.length}`);
  
  // Criar usuários proprietários (3 imóveis por usuário)
  console.log('\n🔄 Criando proprietários...\n');
  
  const ownersPerBatch = 3;
  const numOwners = Math.ceil(allProperties.length / ownersPerBatch);
  
  const ownerIds = [];
  
  for (let i = 0; i < numOwners; i++) {
    const email = `proprietario${i + 1}@kusambwila.ao`;
    const name = `Proprietário ${i + 1}`;
    
    // Verificar se já existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      ownerIds.push(existing[0].id);
      console.log(`👤 ${name} já existe (ID: ${existing[0].id})`);
    } else {
      // Criar novo usuário
      const [result] = await pool.query(
        `INSERT INTO users (firstName, lastName, email, password, phone, userType) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, 'Kusambwila', email, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lWz6fLMP3KWi', '+244900000000', 'landlord']
      );
      ownerIds.push(result.insertId);
      console.log(`👤 ${name} criado (ID: ${result.insertId})`);
    }
  }

  console.log('\n🔄 Importando propriedades para a base de dados...\n');
  
  let importedCount = 0;
  
  for (let i = 0; i < allProperties.length; i++) {
    const prop = allProperties[i];
    const ownerIndex = Math.floor(i / ownersPerBatch);
    const ownerId = ownerIds[ownerIndex];
    
    try {
      // Inserir propriedade
      const [result] = await pool.query(
        `INSERT INTO properties (title, description, price, location, district, type, bedrooms, bathrooms, area, landlordId) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [prop.title, prop.description, prop.price, prop.location, prop.district, prop.type, prop.bedrooms, prop.bathrooms, prop.bedrooms * 40, ownerId]
      );
      
      const propertyId = result.insertId;
      
      // Inserir imagens (apenas referências locais)
      if (prop.images && prop.images.length > 0) {
        // InserirURLs das imagens como referência
        await pool.query(
          `INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, 1)`,
          [propertyId, prop.images[0]]
        );
        
        for (let j = 1; j < prop.images.length; j++) {
          await pool.query(
            `INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, 0)`,
            [propertyId, prop.images[j]]
          );
        }
      }
      
      // Inserir amenidades
      if (prop.amenities && prop.amenities.length > 0) {
        for (const amenity of prop.amenities) {
          // Inserir amenidade se não existir
          await pool.query('INSERT IGNORE INTO amenities (name) VALUES (?)', [amenity]);
          
          // Obter ID da amenidade
          const [amenityResult] = await pool.query('SELECT id FROM amenities WHERE name = ?', [amenity]);
          if (amenityResult.length > 0) {
            await pool.query(
              'INSERT IGNORE INTO property_amenities (propertyId, amenityId) VALUES (?, ?)',
              [propertyId, amenityResult[0].id]
            );
          }
        }
      }
      
      importedCount++;
      console.log(`✅ ${importedCount}. ${prop.title.substring(0, 50)}... -> Proprietário ${ownerIndex + 1}`);
      
    } catch (err) {
      console.error(`❌ Erro ao importar ${prop.title}:`, err.message);
    }
  }

  console.log(`\n🎉 Importação concluída! ${importedCount} propriedades importadas.`);
  
  // Estatísticas finais
  console.log('\n📊 ESTATÍSTICAS:');
  console.log(`- Total de propriedades: ${importedCount}`);
  console.log(`- Total de proprietários: ${ownerIds.length}`);
  console.log(`- Imóveis por proprietário: ${ownersPerBatch}`);
  
  // Listar por distrito
  const districtStats = {};
  for (const prop of allProperties) {
    districtStats[prop.district] = (districtStats[prop.district] || 0) + 1;
  }
  
  console.log('\n📍 Imóveis por Distrito:');
  for (const [district, count] of Object.entries(districtStats)) {
    console.log(`  - ${district}: ${count}`);
  }
  
  process.exit(0);
}

// Executar
initializeDatabase().then(() => {
  importProperties();
}).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});