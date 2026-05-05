// Скрипт для проверки смешанного контента в .next папке
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Паттерн для поиска HTTP URLs 
const HTTP_URL_REGEX = /http:\/\/[^\/\s"']+\.[^\/\s"']+/g;
const LUCKYBOX_HTTP_REGEX = /http:\/\/luckybox\.(su|ru)/g;

// Игнорируемые файлы и директории
const IGNORED_PATHS = [
  'node_modules',
  '.git',
];

async function scanDirectory(directory) {
  try {
    const entries = await readdir(directory);
    
    for (const entry of entries) {
      // Пропускаем игнорируемые пути
      if (IGNORED_PATHS.some(ignoredPath => entry.includes(ignoredPath))) {
        continue;
      }
      
      const entryPath = path.join(directory, entry);
      const entryStats = await stat(entryPath);
      
      if (entryStats.isDirectory()) {
        // Рекурсивное сканирование поддиректорий
        await scanDirectory(entryPath);
      } else if (entryStats.isFile()) {
        // Проверка только определенных типов файлов
        const ext = path.extname(entry).toLowerCase();
        if (['.js', '.json', '.css', '.html', '.htm', '.map'].includes(ext)) {
          try {
            const content = await readFile(entryPath, 'utf8');
            const httpMatches = content.match(HTTP_URL_REGEX);
            const luckyboxHttpMatches = content.match(LUCKYBOX_HTTP_REGEX);
            
            if (httpMatches) {
              console.log(`\nHTTP URL found in: ${entryPath}`);
              console.log('Matches:', [...new Set(httpMatches)].join(', '));
            }
            
            if (luckyboxHttpMatches) {
              console.log(`\nLuckyBox HTTP URL found in: ${entryPath}`);
              console.log('Matches:', [...new Set(luckyboxHttpMatches)].join(', '));
            }
          } catch (error) {
            console.error(`Error reading ${entryPath}:`, error.message);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${directory}:`, error.message);
  }
}

// Запуск сканирования с указанной директории
async function main() {
  console.log('Starting scan for HTTP URLs...');
  const startTime = Date.now();
  const targetDir = path.resolve(process.cwd(), '.next');
  
  console.log(`Scanning directory: ${targetDir}`);
  await scanDirectory(targetDir);
  
  const endTime = Date.now();
  console.log(`\nScan completed in ${(endTime - startTime) / 1000} seconds`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 