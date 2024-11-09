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
        `🎉 Поздравляем! Вы успешно приобрели подарок "${giftName}"!`
      )
    } catch (error) {
      this.p_logger.logError('Ошибка отправки уведомления об оплате:', error)
      throw error
    }
  }
} 