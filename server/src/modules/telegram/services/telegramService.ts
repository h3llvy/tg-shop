import { Bot } from 'grammy'
import { LoggerService } from '../../core/services/loggerService'

export class TelegramService {
  private readonly p_bot: Bot
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
    const token = process.env.BOT_TOKEN
    if (!token) {
      throw new Error('BOT_TOKEN не задан')
    }
    this.p_bot = new Bot(token)
  }

  
  public async notifyPaymentSuccessAsync(userId: number, giftName: string): Promise<void> {
    try {
      await this.p_bot.api.sendMessage(
        userId,
        `✅ You have purchased the gift of ${giftName}.`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "Open Gift",
                web_app: {
                  url: `${process.env.WEBAPP_URL}/gifts/purchased`
                }
              }
            ]]
          }
        }
      )
    } catch (error) {
      this.p_logger.logError('Ошибка отправки уведомления об оплате:', error)
      throw error
    }
  }

  public async sendPaymentSuccessCommand(userId: number, giftId: string): Promise<void> {
    try {
      await this.p_bot.api.sendMessage(
        userId,
        '/payment_success',
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "Открыть подарок",
                web_app: {
                  url: `${process.env.WEBAPP_URL}/gifts/${giftId}/purchased`
                }
              }
            ]]
          }
        }
      )
    } catch (error) {
      this.p_logger.logError('Ошибка отправки команды об успешной оплате:', error)
      throw error
    }
  }

  public async sendMessage(userId: number, message: {
    text: string;
    reply_markup?: any;
  }): Promise<void> {
    try {
      await this.p_bot.api.sendMessage(
        userId,
        message.text,
        message.reply_markup ? { reply_markup: message.reply_markup } : {}
      )
    } catch (error) {
      this.p_logger.logError('Ошибка отправки сообщения:', error)
      throw error
    }
  }
} 