const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Настраиваем логирование в файл
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const outputLogFile = fs.createWriteStream(path.join(logDir, 'app-output.log'), { flags: 'a' });
const errorLogFile = fs.createWriteStream(path.join(logDir, 'app-error.log'), { flags: 'a' });

// Функция для логирования с датой и временем
function log(message) {
    const now = new Date().toISOString();
    const logMessage = `[${now}] ${message}\n`;
    
    // Выводим в консоль
    process.stdout.write(logMessage);
    
    // Записываем в файл
    outputLogFile.write(logMessage);
}

// Функция для логирования ошибок
function logError(message, error) {
    const now = new Date().toISOString();
    const logMessage = `[${now}] ERROR: ${message}\n`;
    let errorDetails = '';
    
    if (error && error.stack) {
        errorDetails = `${error.stack}\n`;
    } else if (error) {
        errorDetails = `${error.toString()}\n`;
    }
    
    // Выводим в консоль ошибок
    process.stderr.write(logMessage + errorDetails);
    
    // Записываем в файл ошибок
    errorLogFile.write(logMessage + errorDetails);
}

// Настройка обработки необработанных ошибок
process.on('uncaughtException', (err) => {
    logError(`Необработанная ошибка: ${err.message}`, err);
});

process.on('unhandledRejection', (err) => {
    logError(`Необработанное отклонение промиса: ${err.message}`, err);
});

// Принудительно устанавливаем production режим
process.env.NODE_ENV = 'production';

log('Запуск приложения...');
log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`PORT: ${process.env.PORT || 3000}`);

const app = next({ 
    dev: false,
    dir: process.cwd(),
    conf: {
        compress: true,
        poweredByHeader: false,
        generateEtags: true,
        trustProxy: true
    }
});

const handle = app.getRequestHandler();

// Карта MIME типов для статических файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
};

// Кеш для найденных файлов, чтобы не искать их заново
const filePathCache = new Map();

// Функция для добавления заголовков безопасности
function addSecurityHeaders(req, res) {
    // Проверяем, является ли запрос HTTPS
    const isSecure = req.headers['x-forwarded-proto'] === 'https' || 
                     req.headers['x-mh-forwarded-proto'] === 'https' || 
                     req.secure || 
                     (req.connection && req.connection.encrypted);
    
    log(`Протокол запроса: ${req.protocol}, isSecure: ${isSecure}`);
    
    // Устанавливаем заголовки для предотвращения смешанного контента
    res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
}

// Функция для поиска Next.js файлов с хешами
function findNextJsFile(filename) {
    // Проверяем кеш
    if (filePathCache.has(filename)) {
        return filePathCache.get(filename);
    }

    const nextDir = path.join(process.cwd(), '.next');
    const searchDirs = [
        path.join(nextDir, 'static', 'chunks'),
        path.join(nextDir, 'static', 'chunks', 'app'),
        path.join(nextDir, 'static', 'chunks', 'app', 'contacts'),
        path.join(nextDir, 'static', 'css'),
        path.join(nextDir, 'static', 'css', 'app'),
        path.join(nextDir, 'static', 'webpack'),
        path.join(nextDir, 'server'),
        path.join(nextDir, 'server', 'app'),
        path.join(nextDir, 'server', 'vendor-chunks'),
        path.join(nextDir, 'static', 'media')
    ];

    // Сначала ищем прямое совпадение
    for (const dir of searchDirs) {
        const filePath = path.join(dir, filename);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            log(`Найден файл по прямому пути: ${filePath}`);
            filePathCache.set(filename, filePath);
            return filePath;
        }
    }

    // Если не найдено, ищем по частичному соответствию хеша
    const hashPattern = filename.match(/(\w+)-(\w+)\.(js|css)$/);
    if (hashPattern) {
        const [_, name, hash, ext] = hashPattern;
        
        // Ищем файлы, содержащие часть хеша или имени
        for (const dir of searchDirs) {
            if (!fs.existsSync(dir)) continue;
            
            const files = fs.readdirSync(dir);
            for (const file of files) {
                // Проверяем, содержит ли файл часть хеша и имеет правильное расширение
                if ((file.includes(name) || (name === 'page' && file.includes('page'))) && 
                     file.endsWith(`.${ext}`)) {
                    const filePath = path.join(dir, file);
                    log(`Найден файл по частичному хешу: ${filePath}`);
                    filePathCache.set(filename, filePath);
                    return filePath;
                }
            }
        }
    }

    // Проверяем, не запрос ли это к чанку приложения
    if (filename.includes('page-') || filename.includes('contacts')) {
        // Ищем специально в директории чанков приложения
        const appChunksDir = path.join(nextDir, 'static', 'chunks', 'app');
        if (fs.existsSync(appChunksDir)) {
            // Ищем рекурсивно, обращая особое внимание на 'contacts'
            const contactsFiles = findFilesRecursively(appChunksDir, (file) => {
                return file.includes('contacts') || file.includes('page-');
            });
            
            if (contactsFiles.length > 0) {
                log(`Найдены файлы страницы контактов: ${contactsFiles.join(', ')}`);
                filePathCache.set(filename, contactsFiles[0]);
                return contactsFiles[0];
            }
        }
    }

    // Ищем рекурсивно
    const foundPath = findFileRecursive(nextDir, filename);
    if (foundPath) {
        filePathCache.set(filename, foundPath);
    }
    return foundPath;

    // Вспомогательная функция для поиска файлов рекурсивно
    function findFileRecursive(dir, filename) {
        if (!fs.existsSync(dir)) return null;
        
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filepath = path.join(dir, file);
            const stat = fs.statSync(filepath);
            
            if (stat.isDirectory()) {
                const found = findFileRecursive(filepath, filename);
                if (found) return found;
            } else if (file === filename || 
                      (hashPattern && file.includes(hashPattern[1]) && file.endsWith(`.${hashPattern[3]}`))) {
                log(`Найден файл рекурсивно: ${filepath}`);
                return filepath;
            }
        }
        
        return null;
    }
    
    // Функция для поиска файлов по предикату
    function findFilesRecursively(dir, predicate) {
        if (!fs.existsSync(dir)) return [];
        
        const result = [];
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filepath = path.join(dir, file);
            const stat = fs.statSync(filepath);
            
            if (stat.isDirectory()) {
                const found = findFilesRecursively(filepath, predicate);
                result.push(...found);
            } else if (predicate(file)) {
                result.push(filepath);
            }
        }
        
        return result;
    }
}

// Функция для обработки статических файлов напрямую
function serveStaticFile(req, res, parsedUrl) {
    const publicDir = path.join(process.cwd(), 'public');
    const nextDir = path.join(process.cwd(), '.next');
    let filePath;
    
    // Обработка запросов к файлам Next.js
    if (parsedUrl.pathname.startsWith('/_next/')) {
        // Специальная обработка для чанков приложения
        if (parsedUrl.pathname.includes('/chunks/app/')) {
            // Вырезаем путь относительно .next директории
            const relativePath = parsedUrl.pathname.replace('/_next', '');
            filePath = path.join(nextDir, relativePath);
            log(`Запрос к чанку приложения: ${filePath}`);
            
            // Проверяем существование файла
            if (!fs.existsSync(filePath)) {
                // Если файл не найден, ищем другие варианты пути
                const filename = path.basename(parsedUrl.pathname);
                const alternativePath = findNextJsFile(filename);
                if (alternativePath) {
                    filePath = alternativePath;
                    log(`Найден альтернативный путь для чанка: ${filePath}`);
                } else {
                    log(`Чанк приложения не найден: ${filePath}`);
                }
            }
        } else if (parsedUrl.pathname.startsWith('/_next/static/')) {
            // Обычные статические файлы Next.js
            filePath = path.join(nextDir, parsedUrl.pathname.replace('/_next', ''));
        } else {
            // Другие файлы Next.js
            const relativePath = parsedUrl.pathname.replace('/_next', '');
            filePath = path.join(nextDir, relativePath);
        }
    } 
    // Проверяем хешированные файлы (CSS, JS) - которые могут идти в корне
    else if (parsedUrl.pathname.match(/\w+-\w+\.(js|css)$/) || 
             parsedUrl.pathname.match(/\.(js|css)$/)) {
        // Получаем имя файла из пути
        const filename = path.basename(parsedUrl.pathname);
        
        // Используем специальную функцию поиска Next.js файлов
        filePath = findNextJsFile(filename);
        
        // Если файл не найден, пробуем обычный путь
        if (!filePath) {
            filePath = path.join(nextDir, 'static', 'chunks', parsedUrl.pathname);
        }
    } else {
        // Обычные публичные файлы
        filePath = path.join(publicDir, parsedUrl.pathname);
    }
    
    log(`Попытка доступа к файлу: ${filePath}`);
    
    // Проверяем, существует ли файл
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Читаем и отправляем файл
        const fileStream = fs.createReadStream(filePath);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        
        // Обрабатываем ошибку чтения файла
        fileStream.on('error', (err) => {
            logError(`Ошибка при чтении файла ${filePath}:`, err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
        
        fileStream.pipe(res);
        return true;
    }
    
    log(`Файл не найден: ${filePath}`);
    return false;
}

// Функция для отправки сообщения в Telegram
async function sendToTelegram(message, chatId, botToken) {
    try {
        log(`Отправка сообщения в Telegram на chatId: ${chatId}`);
        
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        log(`URL запроса к Telegram: ${telegramUrl}`);
        
        const response = await axios.post(telegramUrl, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        }, { 
            timeout: 10000,  // 10 секунд таймаут
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        log(`Сообщение успешно отправлено, ответ Telegram: ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        logError(`Ошибка при отправке сообщения в Telegram: ${error.message}`, error);
        return false;
    }
}

app.prepare()
    .then(() => {
        log('Next.js приложение подготовлено');
        
        const server = createServer(async (req, res) => {
            try {
                log(`${req.method} ${req.url}`);
                
                // Обработка HTTPS заголовков
                if (req.headers['x-forwarded-proto'] === 'https' || req.headers['x-mh-forwarded-proto'] === 'https') {
                    req.protocol = 'https';
                    req.secure = true;
                    log('Запрос определен как HTTPS через заголовки прокси');
                }
                
                // Добавляем заголовки безопасности
                addSecurityHeaders(req, res);
                
                // Анализируем URL
                const parsedUrl = parse(req.url, true);
                
                // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ /api/contact
                if (parsedUrl.pathname === '/api/contact' && req.method === 'POST') {
                    log('⭐ Перехватываем запрос к /api/contact, минуя Next.js');
                    log(`Переменные окружения для API контактов: 
                            TELEGRAM_BOT_TOKEN=${process.env.TELEGRAM_BOT_TOKEN}, 
                            TELEGRAM_CHAT_IDS=${process.env.TELEGRAM_CHAT_IDS || 'отсутствует'}`);
                    
                    // Устанавливаем заголовки CORS
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    
                    // Читаем тело запроса
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                        log(`Получен фрагмент данных: ${chunk.toString()}`);
                    });
                    
                    req.on('end', async () => {
                        log(`Полное тело запроса: ${body}`);
                        
                        try {
                            // Парсим JSON
                            const data = JSON.parse(body);
                            log(`Данные формы: name=${data.name}, email=${data.email}, телефон=${data.phone}, сообщение=${data.message}`);
                            
                            // Формируем текст сообщения для Telegram
                            const messageText = `
📨 Новое сообщение с сайта:

👤 Имя: ${data.name}
📧 Email: ${data.email}
📱 Телефон: ${data.phone}
💬 Сообщение:
${data.message}
                            `;
                            
                            // Получаем ID чатов из переменной окружения
                            const chatIds = (process.env.TELEGRAM_CHAT_IDS || '').split(',').map(id => id.trim());
                            log(`Найдено ${chatIds.length} получателей для отправки сообщения: ${chatIds.join(', ')}`);
                            
                            // Отправляем сообщение всем получателям
                            let sentToAnyone = false;
                            
                            if (chatIds.length > 0 && process.env.TELEGRAM_BOT_TOKEN) {
                                log('Начинаем отправку сообщений всем получателям');
                                
                                for (const chatId of chatIds) {
                                    if (!chatId) continue;
                                    
                                    const success = await sendToTelegram(messageText, chatId, process.env.TELEGRAM_BOT_TOKEN);
                                    if (success) {
                                        sentToAnyone = true;
                                        log(`Сообщение успешно отправлено получателю: ${chatId}`);
                                    } else {
                                        log(`Не удалось отправить сообщение получателю: ${chatId}`);
                                    }
                                }
                            } else {
                                log('Нет получателей или токена бота для отправки сообщения');
                            }
                            
                            // Просто возвращаем успешный ответ, минуя все сложности
                            res.statusCode = 200;
                            res.end(JSON.stringify({ 
                                success: true, 
                                message: sentToAnyone ? 'Сообщение успешно отправлено' : 'Сообщение принято, но не доставлено',
                                sent: sentToAnyone,
                                timestamp: new Date().toISOString()
                            }));
                        } catch (parseError) {
                            log(`Ошибка парсинга JSON: ${parseError.message}`);
                            
                            // Даже при ошибке возвращаем успешный ответ
                            res.statusCode = 200;
                            res.end(JSON.stringify({ 
                                success: true, 
                                message: 'Данные приняты, но не удалось обработать JSON',
                                error: parseError.message
                            }));
                        }
                    });
                    
                    return; // Завершаем обработку здесь
                }
                
                // CORS pre-flight запросы для API
                if (req.method === 'OPTIONS' && parsedUrl.pathname.startsWith('/api/')) {
                    log('Обрабатываем CORS pre-flight запрос');
                    
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                    res.setHeader('Access-Control-Max-Age', '86400'); // 24 часа
                    
                    res.statusCode = 204; // No Content
                    res.end();
                    return;
                }
                
                // Проверяем, является ли запрос запросом статического файла
                const isStaticFile = parsedUrl.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf)$/i) || 
                                    parsedUrl.pathname.match(/\w+-\w+\.(js|css)$/);
                
                // Проверяем запросы к Next.js файлам
                const isNextRequest = parsedUrl.pathname.startsWith('/_next/');
                
                if (isStaticFile || isNextRequest) {
                    // Устанавливаем таймаут для запроса (30 секунд)
                    req.setTimeout(30000);
                    
                    // Пытаемся обработать статический файл напрямую
                    const served = serveStaticFile(req, res, parsedUrl);
                    if (served) {
                        return;
                    }
                    
                    // Если файл не найден напрямую, логируем это
                    log(`Статический файл не обслужен напрямую: ${parsedUrl.pathname}`);
                }
                
                // Добавляем логирование для API запросов
                if (parsedUrl.pathname.startsWith('/api/')) {
                    log(`Обрабатываем API запрос: ${req.method} ${parsedUrl.pathname}`);
                    log(`Протокол API запроса: ${req.protocol}, Secure: ${req.secure ? 'да' : 'нет'}`);
                    
                    // Собираем все заголовки запроса для логирования
                    const headers = JSON.stringify(req.headers);
                    log(`API запрос заголовки: ${headers}`);
                    
                    // Особое внимание к /api/contact
                    if (parsedUrl.pathname === '/api/contact') {
                        log('Получен запрос к API контактов');
                        
                        // Парсим тело запроса
                        let body = [];
                        req.on('data', (chunk) => {
                            body.push(chunk);
                        });
                        
                        req.on('end', () => {
                            try {
                                body = Buffer.concat(body).toString();
                                log(`API запрос тело: ${body}`);
                                
                                // Проверяем, является ли тело JSON
                                try {
                                    const jsonBody = JSON.parse(body);
                                    log(`API запрос JSON: ${JSON.stringify(jsonBody)}`);
                                    
                                    // Логируем наличие необходимых полей
                                    log(`Поля формы: name=${!!jsonBody.name}, email=${!!jsonBody.email}, phone=${!!jsonBody.phone}, message=${!!jsonBody.message}`);
                                } catch (jsonErr) {
                                    log(`Не удалось распарсить JSON: ${jsonErr.message}`);
                                }
                            } catch (bodyErr) {
                                log(`Ошибка чтения тела запроса: ${bodyErr.message}`);
                            }
                        });
                        
                        // Логируем результат запроса
                        const originalEnd = res.end;
                        res.end = function(chunk, encoding) {
                            log(`API ответ [${res.statusCode}]: ${parsedUrl.pathname}`);
                            if (chunk) {
                                log(`API ответ тело: ${chunk.toString()}`);
                            }
                            originalEnd.call(this, chunk, encoding);
                        };
                        
                        // Логируем окружение для API контактов
                        log(`Переменные окружения для API контактов: 
                            TELEGRAM_BOT_TOKEN=${process.env.TELEGRAM_BOT_TOKEN ? 'установлен' : 'отсутствует'}, 
                            TELEGRAM_CHAT_IDS=${process.env.TELEGRAM_CHAT_IDS || 'отсутствует'}`);
                    }
                }
                
                // Проверяем, является ли это запросом к странице контактов
                if (parsedUrl.pathname === '/contacts' || parsedUrl.pathname === '/contacts/') {
                    log('Обрабатываем запрос к странице контактов');
                    
                    // Устанавливаем таймаут для запроса (30 секунд)
                    req.setTimeout(30000);
                    
                    // Специальная обработка для запросов к странице контактов
                    try {
                        // Предварительно проверяем наличие файлов чанков для contacts
                        const appChunksDir = path.join(process.cwd(), '.next', 'static', 'chunks', 'app', 'contacts');
                        if (fs.existsSync(appChunksDir)) {
                            log(`Директория чанков contacts существует: ${appChunksDir}`);
                            const files = fs.readdirSync(appChunksDir);
                            log(`Файлы в директории contacts: ${files.join(', ')}`);
                        } else {
                            log(`Директория чанков contacts не существует: ${appChunksDir}`);
                        }
                    } catch (dirErr) {
                        logError('Ошибка при проверке директории contacts:', dirErr);
                    }
                }
                
                // Если это не статический файл или файл не найден, 
                // передаем обработку Next.js
                await handle(req, res, parsedUrl);
            } catch (err) {
                logError(`Ошибка при обработке запроса: ${err.message}`, err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        });

        const port = parseInt(process.env.PORT, 10) || 3000;
        server.listen(port, (err) => {
            if (err) {
                logError(`Ошибка при запуске сервера: ${err.message}`, err);
                process.exit(1);
            }
            log(`> Сервер запущен на порту ${port}`);
        });

        // Обработка сигналов завершения
        const cleanup = () => {
            log('Получен сигнал завершения, закрываю сервер...');
            server.close(() => {
                log('Сервер остановлен');
                
                // Закрываем файлы логов перед выходом
                outputLogFile.end();
                errorLogFile.end();
                
                process.exit(0);
            });
        };

        process.on('SIGTERM', cleanup);
        process.on('SIGINT', cleanup);
    })
    .catch((err) => {
        logError(`Ошибка при подготовке Next.js приложения: ${err.message}`, err);
        process.exit(1);
    }); 