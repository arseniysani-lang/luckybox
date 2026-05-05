const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const GALLERY_DIR = path.join(PUBLIC_DIR, 'gallery');

// Создаем WebP версии всех изображений
async function convertToWebP(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/, '.webp');
    
    // Если WebP уже существует, пропускаем
    if (fs.existsSync(outputPath)) {
      return;
    }
    
    console.log(`Converting to WebP: ${path.basename(imagePath)}`);
    await sharp(imagePath)
      .webp({ quality: 80 })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Error converting ${imagePath} to WebP:`, error);
  }
}

// Оптимизация JPEG и PNG используя только sharp
async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const optimizedPath = imagePath.replace(/\.(jpg|jpeg|png)$/, `-optimized$&`);
  
  try {
    if (ext === '.jpg' || ext === '.jpeg') {
      console.log(`Optimizing JPEG: ${path.basename(imagePath)}`);
      await sharp(imagePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(optimizedPath);
      
      // Заменяем оригинальный файл оптимизированным
      fs.unlinkSync(imagePath);
      fs.renameSync(optimizedPath, imagePath);
    } else if (ext === '.png') {
      console.log(`Optimizing PNG: ${path.basename(imagePath)}`);
      await sharp(imagePath)
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(optimizedPath);
      
      // Заменяем оригинальный файл оптимизированным
      fs.unlinkSync(imagePath);
      fs.renameSync(optimizedPath, imagePath);
    }
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
}

// Генерация AVIF версии
async function convertToAVIF(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/, '.avif');
    
    // Если AVIF уже существует, пропускаем
    if (fs.existsSync(outputPath)) {
      return;
    }
    
    console.log(`Converting to AVIF: ${path.basename(imagePath)}`);
    await sharp(imagePath)
      .avif({ quality: 65 })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Error converting ${imagePath} to AVIF:`, error);
  }
}

// Рекурсивный поиск всех изображений
function findImages(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findImages(itemPath));
    } else {
      const ext = path.extname(itemPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        results.push(itemPath);
      }
    }
  }
  
  return results;
}

async function main() {
  // Находим все изображения в директории public
  const images = findImages(PUBLIC_DIR);
  
  console.log(`Found ${images.length} images to process`);
  
  // Создаем папку для временных файлов, если её нет
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  // Обрабатываем каждое изображение
  for (const image of images) {
    await convertToWebP(image);
    await convertToAVIF(image);
    await optimizeImage(image);
  }
  
  console.log('Image optimization complete!');
}

main().catch(error => {
  console.error('Error during image optimization:', error);
  process.exit(1);
}); 