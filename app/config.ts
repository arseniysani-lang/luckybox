// Определяем интерфейс для конфигурации
interface AppConfig {
  telegramBotToken: string;
  telegramChatIds: string[];
  isConfigValid: () => boolean;
}

export const config: AppConfig = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN?.trim() || '',
  telegramChatIds: (process.env.TELEGRAM_CHAT_IDS || '')
    .split(',')
    .map(id => id.trim())
    .filter(id => id !== ''),
  
  // Добавляем функции для проверки конфигурации
  isConfigValid: function() {
    return this.telegramBotToken && this.telegramChatIds.length > 0;
  }
}; 