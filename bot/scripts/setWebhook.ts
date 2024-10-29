import 'dotenv/config'
import { Bot } from 'grammy'
import { config } from '../src/config'

const setWebhookAsync = async (): Promise<void> => {
  try {
    const bot = new Bot(config.BOT_TOKEN)
    const webhookUrl = `${config.WEBHOOK_DOMAIN}${config.WEBHOOK_PATH}`
    
    await bot.api.setWebhook(webhookUrl, {
      allowed_updates: ['message', 'callback_query']
    })
    
    const info = await bot.api.getWebhookInfo()
    console.log('Вебхук успешно установлен:', info)
  } catch (error) {
    console.error('Ошибка установки вебхука:', error)
    process.exit(1)
  }
}

setWebhookAsync()
