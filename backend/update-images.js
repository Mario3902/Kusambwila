const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/dell/Downloads/Kusambwila website design';
const imagesDir = path.join(baseDir, 'src/app/public/images/properties');

const folderToDistrict = {
  'Benfica/comercial 1': 'Benfica',
  'Cacuaco/casa t3.3': 'Cacuaco',
  'ingombota/casa t3': 'Ingombota',
  'Kilamba/casa t2': 'Kilamba',
  'Kilamba/apartamento t3.3.3.3': 'Kilamba',
  'Maianga/comercial': 'Maianga',
  'Maianga/casa t3': 'Maianga',
  'Maianga/apartamento t2.2': 'Maianga',
  'Miramar/casa t3.3': 'Miramar',
  'Talatona/casa t2': 'Talatona',
  'Talatona/apartamento t2.2': 'Talatona',
  'viana/casa t3': 'Viana',
  'viana/casa t2.2': 'Viana',
  'Alvalade': 'Alvalade'
};

async function updateImages() {
  const connection = await pool.getConnection();
  
  try {
    const [properties] = await connection.query('SELECT id, district FROM properties ORDER BY id');
    console.log(`Total properties: ${properties.length}`);
    
    const propertiesByDistrict = {};
    for (const p of properties) {
      if (!propertiesByDistrict[p.district]) {
        propertiesByDistrict[p.district] = [];
      }
      propertiesByDistrict[p.district].push(p.id);
    }
    
    let totalAdded = 0;
    
    for (const [folder, district] of Object.entries(folderToDistrict)) {
      const folderPath = path.join(baseDir, 'casas de alugar', folder);
      if (!fs.existsSync(folderPath)) continue;
      
      const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg'));
      console.log(`\n${folder} (${district}): ${images.length} images`);
      
      const propertyIds = propertiesByDistrict[district];
      if (!propertyIds || propertyIds.length === 0) {
        console.log(`  No properties found for district: ${district}`);
        continue;
      }
      
      let propIndex = 0;
      for (const img of images) {
        const propertyId = propertyIds[propIndex];
        const srcPath = path.join(folderPath, img);
        const destPath = path.join(imagesDir, `${propertyId}_${img}`);
        
        fs.copyFileSync(srcPath, destPath);
        
        const url = `/images/properties/${propertyId}_${img}`;
        
        const [existing] = await connection.query(
          'SELECT id FROM property_images WHERE propertyId = ? AND url = ?',
          [propertyId, url]
        );
        
        if (existing.length === 0) {
          await connection.query(
            'INSERT INTO property_images (propertyId, url, isPrimary) VALUES (?, ?, 0)',
            [propertyId, url]
          );
          console.log(`  Added to property ${propertyId}: ${img}`);
          totalAdded++;
        }
        
        propIndex++;
        if (propIndex >= propertyIds.length) propIndex = 0;
      }
    }
    
    console.log(`\n=== Total imagens adicionadas: ${totalAdded} ===`);
    
    const [allImages] = await connection.query('SELECT COUNT(*) as total FROM property_images');
    console.log(`Total imagens na BD: ${allImages[0].total}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

updateImages();