import 'dotenv/config'
import { Bot } from 'grammy'
import { config } from '../src/config'

const deleteWebhookAsync = async (): Promise<void> => {
  try {
    const bot = new Bot(config.BOT_TOKEN)
    await bot.api.deleteWebhook()
    console.log('Вебхук успешно удален')
  } catch (error) {
    console.error('Ошибка удаления вебхука:', error)
    process.exit(1)
  }
}

deleteWebhookAsync()
