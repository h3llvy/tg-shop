import { Bot } from 'grammy'
import { config } from '../../../config'
import { BotContext } from '../../../types/bot'

export class WebhookService {
  private readonly bot: Bot<BotContext>
  private readonly webhookUrl: string

  constructor(bot: Bot<BotContext>) {
    this.bot = bot
    this.webhookUrl = `${config.WEBHOOK_DOMAIN}${config.WEBHOOK_PATH}`
  }

  async setupWebhook() {
    try {
      // Удаляем старый вебхук если есть
      await this.bot.api.deleteWebhook()
      
      // Устанавливаем новый вебхук
      await this.bot.api.setWebhook(this.webhookUrl, {
        allowed_updates: ['message', 'callback_query']
      })

      const webhookInfo = await this.bot.api.getWebhookInfo()
      console.log('Webhook установлен:', webhookInfo)
    } catch (error) {
      console.error('Ошибка установки вебхука:', error)
      throw error
    }
  }
}
