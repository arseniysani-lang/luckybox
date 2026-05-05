/**
 * Сервер разработки
 * Запускает Next.js в режиме dev, сохраняя оригинальные настройки хостинга
 */
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Пути к файлам
const ENV_LOCAL = path.join(__dirname, '.env.local');
const ENV_LOCAL_BACKUP = path.join(__dirname, '.env.local.backup');
const ENV_DEVELOPMENT = path.join(__dirname, '.env.development');

// Функция для корректного завершения работы
function cleanup() {
  console.log('\n\nВосстановление настроек...');
  
  // Восстанавливаем оригинальный .env.local
  if (fs.existsSync(ENV_LOCAL_BACKUP)) {
    fs.copyFileSync(ENV_LOCAL_BACKUP, ENV_LOCAL);
    fs.unlinkSync(ENV_LOCAL_BACKUP);
    console.log('Оригинальный .env.local восстановлен.');
  }
  
  console.log('Локальный сервер остановлен.');
  process.exit(0);
}

// Регистрируем обработчики завершения
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Создаем резервную копию .env.local
if (fs.existsSync(ENV_LOCAL)) {
  console.log('Создание бэкапа .env.local...');
  fs.copyFileSync(ENV_LOCAL, ENV_LOCAL_BACKUP);
}

// Копируем файл разработки
console.log('Применение настроек для локальной разработки...');
if (fs.existsSync(ENV_DEVELOPMENT)) {
  fs.copyFileSync(ENV_DEVELOPMENT, ENV_LOCAL);
} else {
  console.error('Файл .env.development не найден. Создайте его перед запуском.');
  process.exit(1);
}

console.log('Запуск Next.js в режиме разработки...');
console.log('Для остановки нажмите Ctrl+C\n');

// Запускаем Next.js в dev режиме
const nextProcess = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('Ошибка запуска Next.js:', error);
  cleanup();
});

nextProcess.on('close', (code) => {
  console.log(`Next.js завершил работу с кодом ${code}`);
  cleanup();
}); 