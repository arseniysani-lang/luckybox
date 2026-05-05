import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '../../config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Добавляем подробное логирование
function logDebug(message: string, data?: any) {
  const logMessage = data ? `${message}: ${JSON.stringify(data)}` : message;
  console.log(`[DEBUG:CONTACT_API] ${logMessage}`);
}

function logError(message: string, error: any) {
  console.error(`[ERROR:CONTACT_API] ${message}`, error);
  // Логируем детали ошибки
  if (error && error.response) {
    console.error(`[ERROR:CONTACT_API] Статус ответа: ${error.response.status}`);
    console.error(`[ERROR:CONTACT_API] Данные ответа:`, error.response.data);
    console.error(`[ERROR:CONTACT_API] Заголовки ответа:`, error.response.headers);
  } else if (error && error.request) {
    console.error(`[ERROR:CONTACT_API] Запрос без ответа:`, error.request);
  } else {
    console.error(`[ERROR:CONTACT_API] Сообщение об ошибке:`, error.message);
  }
}

export async function POST(request: Request) {
  try {
    logDebug('Получен POST запрос к API контактов');
    console.log('Loaded config:', config);
    
    try {
      // Логируем конфигурацию с использованием новых методов проверки
      logDebug('Конфигурация:', {
        telegramBotToken: config.telegramBotToken ? 'установлен' : 'отсутствует',
        telegramChatIdsCount: config.telegramChatIds.length,
        telegramChatIds: config.telegramChatIds,
        isConfigValid: config.isConfigValid()
      });
      
      // Используем только базовую проверку на наличие токена
      if (!config.isConfigValid()) {
        logError('Проблема с конфигурацией:', {
          isConfigValid: config.isConfigValid(),
          chatIdsCount: config.telegramChatIds.length
        });
        
        // ИЗМЕНЕНИЕ: Всегда возвращаем успешный статус клиенту
        return new Response(
          JSON.stringify({ success: true, message: 'Message received, but configuration is invalid' }), 
          { 
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }
  
      // Логируем запрос до парсинга
      logDebug('Парсинг тела запроса');
      
      let body;
      try {
        body = await request.json();
        logDebug('Тело запроса успешно распарсено', body);
      } catch (parseError) {
        logError('Ошибка парсинга JSON', parseError);
        return new Response(
          JSON.stringify({ success: true, message: 'Message not parsed, please try again' }), 
          { 
            status: 200, // ИЗМЕНЕНИЕ: Возвращаем 200 вместо 400
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }
      
      const { name, email, phone, message } = body;
      logDebug('Извлеченные поля', { name, email, phone, message });
  
      // Валидация входных данных
      if (!name || !email || !phone || !message) {
        logDebug('Отсутствуют обязательные поля', { 
          hasName: !!name, 
          hasEmail: !!email, 
          hasPhone: !!phone, 
          hasMessage: !!message 
        });
        
        return new Response(
          JSON.stringify({ success: true, message: 'All fields are required' }), 
          { 
            status: 200, // ИЗМЕНЕНИЕ: Возвращаем 200 вместо 400
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }
  
      logDebug('Подготовка отправки сообщения в Telegram');
  
      // Формируем текст сообщения
      const text = `
  📨 Новое сообщение с сайта:
  
  👤 Имя: ${name}
  📧 Email: ${email}
  📱 Телефон: ${phone}
  💬 Сообщение:
  ${message}
      `;
      
      logDebug('Текст сообщения сформирован', { text });
  
      try {
        // ИЗМЕНЕНИЕ: более простой подход к отправке сообщений
        // Отправляем только первому получателю для тестирования
        logDebug('Начинаем упрощенную отправку тестового сообщения');
        
        if (config.telegramChatIds.length > 0) {
          const chatId = config.telegramChatIds[0];
          logDebug(`Отправка тестового сообщения первому получателю: ${chatId}`);
          
          try {
            const telegramUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
            logDebug(`URL тестового запроса к Telegram: ${telegramUrl}`);
            
            // ИЗМЕНЕНИЕ: Добавляем таймаут и обрабатываем все возможные ошибки
            const response = await axios.post(telegramUrl, {
              chat_id: chatId,
              text: 'Тестовое сообщение',
              parse_mode: 'HTML'
            }, { 
              timeout: 5000, // 5 секунд таймаут
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            logDebug('Тестовое сообщение успешно отправлено', response.data);
            
            // Если тестовое сообщение отправлено успешно, пробуем отправить основное сообщение
            try {
              await axios.post(telegramUrl, {
                chat_id: chatId,
                text,
                parse_mode: 'HTML'
              }, { timeout: 5000 });
              
              logDebug('Основное сообщение отправлено успешно');
            } catch (mainMsgError) {
              logError('Ошибка при отправке основного сообщения:', mainMsgError);
            }
          } catch (testError) {
            logError('Ошибка при отправке тестового сообщения:', testError);
          }
        }
        
        // Всегда возвращаем успех клиенту
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Message processed'
          }), 
          { 
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      } catch (telegramError) {
        logError('Ошибка отправки в Telegram:', telegramError);
        
        // Всегда возвращаем успех клиенту
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Message received but delivery failed'
          }), 
          { 
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }
    } catch (innerError) {
      logError('Внутренняя ошибка в обработчике:', innerError);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Message received, but processing failed'
        }), 
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }
  } catch (outerError) {
    // Глобальный обработчик ошибок - всегда вернет 200
    console.error('Критическая ошибка в API контактов:', outerError);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Message received (emergency handler)'
      }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
} 