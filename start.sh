#!/bin/bash

# Переходим в директорию сайта
cd ~/luckybox.su/www

# Останавливаем все существующие процессы node
echo "Останавливаю существующие процессы..."
pkill -f "node.*luckybox"
sleep 2

# Очищаем старые логи
echo "Очищаю старые логи..."
mkdir -p logs
rm -f logs/*.log

# Проверяем наличие сборки
if [ ! -d ".next" ]; then
    echo "Сборка отсутствует. Выполняю npm run build..."
    npm run build
fi

# Устанавливаем переменные окружения
export NODE_ENV=production
export PORT=3000
export NODE_OPTIONS="--max-old-space-size=512"

# Запускаем приложение с ограничением памяти
echo "Запускаю сайт..."
node app.js > logs/output.log 2> logs/error.log &

# Сохраняем PID процесса
echo $! > logs/app.pid

# Проверяем, запустился ли процесс
sleep 5
PID=$(cat logs/app.pid)
if ps -p $PID > /dev/null; then
    echo "Сайт успешно запущен (PID: $PID)"
    echo "Использование памяти:"
    ps -o pid,ppid,%mem,rss,cmd -p $PID
else
    echo "Ошибка при запуске сайта. Проверьте логи в logs/error.log"
    tail -n 50 logs/error.log
    exit 1
fi 