require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kusambwila_db',
  waitForConnections: true,
  connectionLimit: 10,
});

const CASAS_DIR = path.join(__dirname, '..', 'casas de alugar');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'properties');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function normalizeDistrict(name) {
  const map = {
    'alvalade': 'Alvalade', 'benfica': 'Benfica', 'cacuaco': 'Cacuaco',
    'kilamba': 'Kilamba', 'maianga': 'Maianga', 'miramar': 'Miramar',
    'talatona': 'Talatona', 'ingombota': 'Ingombota', 'viana': 'Viana',
  };
  return map[name.toLowerCase()] || name;
}

// Supports both tab-based (field\tvalue) and newline-based (field:\nvalue) formats
function parseDescription(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);

  let title = '', description = '', type = 'house', price = 0;
  let bedrooms = 1, bathrooms = 1, area = null, location = '', amenities = [];

  // Tab-separated format
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (line.includes('\t')) {
      const parts = line.split('\t');
      const key = parts[0].toLowerCase().trim();
      const val = parts.slice(1).join('\t').trim();

      if (key.includes('título do anúncio') || key.includes('titulo do anuncio')) title = val;
      else if (key === 'descrição' || key === 'descricao') description = val;
      else if (key.includes('preço') && !description) { /* skip */ }
      else if (key.includes('preço')) {
        const m = val.match(/[\d\.]+/);
        if (m) price = parseInt(m[0].replace(/\./g, '')) || 0;
      }
      else if (key.includes('quartos')) { const m = val.match(/\d+/); if (m) bedrooms = parseInt(m[0]); }
      else if (key.includes('casas de banho')) { const m = val.match(/\d+/); if (m) bathrooms = parseInt(m[0]); }
      else if (key.includes('área')) { const m = val.match(/\d+/); if (m) area = parseInt(m[0]); }
      else if (key.includes('localização completa')) location = val;
      else if (key.includes('comodidades')) amenities = val.split(',').map(a => a.trim()).filter(a => a);
      else if (key.includes('tipo de imóvel')) {
        const v = val.toLowerCase();
        if (v.includes('apartamento')) type = 'apartment';
        else if (v.includes('vivenda') || v.includes('villa')) type = 'villa';
        else if (v.includes('comercial') || v.includes('escritório')) type = 'commercial';
        else if (v.includes('studio')) type = 'studio';
        else type = 'house';
      }
    }
  }

  // Newline-separated format (keyword: on one line, value on next)
  for (let i = 0; i < lines.length; i++) {
    const key = lines[i].toLowerCase().trim();
    const next = (lines[i + 1] || '').trim();

    if (!title && (key === 'título do anúncio:' || key === 'titulo do anuncio:') && next) {
      title = next;
    } else if (!description && key === 'descrição:' && next) {
      const parts = [];
      for (let j = i + 1; j < lines.length && j < i + 10; j++) {
        const l = lines[j].trim();
        if (l.endsWith(':') && l.length < 60 && !l.startsWith('•')) break;
        if (l.match(/^\d+\./)) break;
        if (l) parts.push(l);
      }
      description = parts.map(p => p.replace(/^•\s*/, '')).join(' ');
    } else if (!price && key.match(/^preço\s*(mensal)?\s*(\(kz\))?:/) && next) {
      const m = next.match(/[\d\.]+/);
      if (m) price = parseInt(m[0].replace(/\./g, '')) || 0;
    } else if (key === 'quartos:' && next) {
      const m = next.match(/\d+/);
      if (m && parseInt(m[0]) > 0) bedrooms = parseInt(m[0]);
    } else if (key === 'casas de banho:' && next) {
      const m = next.match(/\d+/);
      if (m && parseInt(m[0]) > 0) bathrooms = parseInt(m[0]);
    } else if (key === 'área (m²):' && next && next.match(/\d+/)) {
      const m = next.match(/\d+/);
      if (m) area = parseInt(m[0]);
    } else if (!location && key === 'localização completa:' && next) {
      location = next;
    } else if (key === 'comodidades:' && next && !next.startsWith('(')) {
      amenities = next.split(',').map(a => a.trim()).filter(a => a);
    } else if (key === 'tipo de imóvel:' && next) {
      const v = next.toLowerCase();
      if (v.includes('apartamento')) type = 'apartment';
      else if (v.includes('vivenda') || v.includes('villa')) type = 'villa';
      else if (v.includes('comercial') || v.includes('escritório')) type = 'commercial';
      else if (v.includes('studio')) type = 'studio';
      else if (v.includes('casa') || v.includes('moradia')) type = 'house';
    }
  }

  return { title, description, type, price, bedrooms, bathrooms, area, location, amenities };
}

function guessTypeFromFolder(folderName) {
  const lower = folderName.toLowerCase();
  if (lower.includes('apartamento')) return 'apartment';
  if (lower.includes('villa') || lower.includes('vivenda')) return 'villa';
  if (lower.includes('studio')) return 'studio';
  if (lower.includes('comercial')) return 'commercial';
  return 'house';
}

function getBedroomsFromFolder(folderName) {
  const match = folderName.match(/t(\d+)/i);
  if (match) return parseInt(match[1]);
  return 1;
}

async function importHouses() {
  console.log('\n🏠 Importando casas reais da pasta "casas de alugar"...\n');

  const [users] = await pool.query("SELECT id FROM users WHERE userType = 'admin' LIMIT 1");
  const adminId = users[0]?.id || 1;
  const [landlords] = await pool.query("SELECT id FROM users WHERE userType = 'landlord' LIMIT 1");
  let landlordId = landlords[0]?.id || adminId;

  // Delete previously imported local properties (those with /uploads/properties images)
  console.log('🗑️  Removendo importações anteriores...');
  const [prevProps] = await pool.query(`
    SELECT DISTINCT p.id FROM properties p 
    JOIN property_images pi ON p.id = pi.propertyId 
    WHERE pi.url LIKE '/uploads/properties/%'
  `);
  if (prevProps.length > 0) {
    const ids = prevProps.map(r => r.id);
    await pool.query(`DELETE FROM property_images WHERE propertyId IN (${ids.join(',')})`);
    await pool.query(`DELETE FROM properties WHERE id IN (${ids.join(',')})`);
    console.log(`  ✅ Removidas ${prevProps.length} propriedades anteriores\n`);
  }

  let totalInserted = 0, totalImages = 0;

  const regions = fs.readdirSync(CASAS_DIR).filter(f =>
    fs.statSync(path.join(CASAS_DIR, f)).isDirectory()
  );

  for (const region of regions) {
    const regionPath = path.join(CASAS_DIR, region);
    const district = normalizeDistrict(region);

    const propertyFolders = fs.readdirSync(regionPath).filter(f =>
      fs.statSync(path.join(regionPath, f)).isDirectory()
    );

    for (const propFolder of propertyFolders) {
      const propPath = path.join(regionPath, propFolder);
      const files = fs.readdirSync(propPath);

      const descFile = files.find(f => f.toLowerCase().endsWith('.txt'));
      const imageFiles = files.filter(f =>
        ['.jpg', '.jpeg', '.png', '.webp'].some(ext => f.toLowerCase().endsWith(ext))
      );

      let propData = {
        title: '',
        description: '',
        type: guessTypeFromFolder(propFolder),
        price: 0,
        bedrooms: getBedroomsFromFolder(propFolder),
        bathrooms: 1,
        area: null,
        location: `${district}, Luanda`,
        amenities: [],
      };

      if (descFile) {
        try {
          const content = fs.readFileSync(path.join(propPath, descFile), 'utf8');
          const parsed = parseDescription(content);
          if (parsed.title) propData.title = parsed.title;
          if (parsed.description) propData.description = parsed.description;
          if (parsed.type) propData.type = parsed.type;
          if (parsed.price) propData.price = parsed.price;
          if (parsed.bedrooms > 0) propData.bedrooms = parsed.bedrooms;
          if (parsed.bathrooms > 0) propData.bathrooms = parsed.bathrooms;
          if (parsed.area) propData.area = parsed.area;
          if (parsed.location) propData.location = parsed.location;
        } catch (e) { /* ignore read errors */ }
      }

      if (!propData.title) {
        const typeLabel = propFolder.includes('apartamento') ? 'Apartamento' :
          propFolder.includes('comercial') ? 'Espaço Comercial' : 'Casa';
        const bedroomStr = propFolder.match(/t(\d+)/i)?.[0]?.toUpperCase() || '';
        propData.title = `${typeLabel} ${bedroomStr} em ${district}`;
      }
      if (!propData.description) {
        propData.description = `${propData.type === 'apartment' ? 'Apartamento' : 'Moradia'} disponível para arrendamento em ${district}, Luanda. ${propData.bedrooms} quarto(s), ${propData.bathrooms} casa(s) de banho.`;
      }

      try {
        const [result] = await pool.query(
          `INSERT INTO properties (title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [propData.title, propData.description, propData.price, propData.location,
            district, propData.type, propData.bedrooms, propData.bathrooms, propData.area, 0, landlordId]
        );

        const propertyId = result.insertId;
        console.log(`  ✅ ${propData.title} (${district}) - ${propData.price.toLocaleString()} Kz`);

        let isPrimary = 1;
        for (const imgFile of imageFiles.slice(0, 8)) {
          const srcPath = path.join(propPath, imgFile);
          const ext = path.extname(imgFile);
          const newName = `prop_${propertyId}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
          const destPath = path.join(UPLOADS_DIR, newName);
          fs.copyFileSync(srcPath, destPath);

          await pool.query(
            `INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, ?)`,
            [propertyId, `/uploads/properties/${newName}`, isPrimary]
          );
          isPrimary = 0;
          totalImages++;
        }
        totalInserted++;
      } catch (err) {
        console.error(`  ❌ Erro: "${propData.title}": ${err.message}`);
      }
    }
  }

  console.log(`\n════════════════════════════════════════════════════════`);
  console.log(`✅ IMPORTAÇÃO COMPLETA!`);
  console.log(`════════════════════════════════════════════════════════`);
  console.log(`📊 Resumo:`);
  console.log(`  • Propriedades importadas: ${totalInserted}`);
  console.log(`  • Imagens copiadas: ${totalImages}`);
  console.log(`════════════════════════════════════════════════════════\n`);

  await pool.end();
}

importHouses().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
