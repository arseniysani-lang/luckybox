@echo off
echo === Запуск локальной версии сайта ===
echo.
echo Этот скрипт запустит сайт локально, не затрагивая настройки для хостинга.
echo.

:: Проверка наличия установленных модулей
if not exist node_modules (
    echo Установка зависимостей...
    call npm install
) else (
    echo Зависимости установлены.
)

:: Создание резервной копии оригинального .env.local (если существует)
if exist .env.local (
    echo Создание бэкапа .env.local...
    copy .env.local .env.local.backup > nul
)

:: Копирование файла разработки
echo Применение настроек для локальной разработки...
copy .env.development .env.local > nul

:: Запуск сайта
echo.
echo Запуск сайта на http://localhost:3000
echo Для остановки нажмите Ctrl+C
echo.

call npm run local

:: Восстановление оригинального .env.local
echo.
echo Восстановление оригинальных настроек...
if exist .env.local.backup (
    copy .env.local.backup .env.local > nul
    del .env.local.backup
)

echo.
echo Локальный сервер остановлен.
echo === Завершение работы === 