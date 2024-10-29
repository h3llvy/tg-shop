import 'dotenv/config'
import { Bot } from 'grammy'
import { setupBot } from './modules/core/setupBot'
import { setupErrorHandling } from './modules/core/errorHandler'
import { WebhookService } from './modules/core/services/webhookService'
import { config } from './config'
import { BotContext, HandlerBot } from './types/bot'

async function startBotAsync() {
  try {
    // Создаем экземпляр бота с правильным типом
    const bot = new Bot<BotContext>(config.BOT_TOKEN)
    
    // Настраиваем бота
    const configuredBot = setupBot(bot) as HandlerBot // Явно указываем тип
    setupErrorHandling(configuredBot)
    
    // Проверяем текущий вебхук
    const webhookInfo = await bot.api.getWebhookInfo()
    const webhookService = new WebhookService(configuredBot)
    
    // Устанавливаем вебхук только если он не установлен или URL изменился
    if (!webhookInfo.url || webhookInfo.url !== `${config.WEBHOOK_DOMAIN}${config.WEBHOOK_PATH}`) {
      await webhookService.setupWebhook()
    }
    
    // Запускаем бота
    await configuredBot.start({
      onStart: (botInfo) => {
        console.log(`Бот ${botInfo.username} успешно запущен`)
      }
    })
  } catch (error) {
    console.error('Ошибка запуска бота:', error)
    process.exit(1)
  }
}

startBotAsync()
