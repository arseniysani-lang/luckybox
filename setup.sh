#!/bin/bash

# Установка Node.js через NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Установка PM2
npm install pm2 -g

# Установка зависимостей проекта
npm install --production --no-optional

# Запуск приложения через PM2
pm2 start ecosystem.config.js
pm2 save

# Добавление PM2 в автозапуск
pm2 startup 