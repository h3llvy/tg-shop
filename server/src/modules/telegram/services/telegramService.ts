import { Bot } from 'grammy'

export class TelegramService {
  private readonly p_bot: Bot

  constructor() {
    const token = process.env.BOT_TOKEN
    if (!token) {
      throw new Error('Не задан BOT_TOKEN')
    }
    this.p_bot = new Bot(token)
  }

  public async sendMessageAsync(_chatId: number, _text: string): Promise<void> {
    try {
      await this.p_bot.api.sendMessage(_chatId, _text)
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      throw error
    }
  }

  public async notifyGiftPurchaseAsync(_chatId: number, _giftName: string): Promise<void> {
    const message = `Поздравляем! Вы успешно приобрели подарок "${_giftName}"`
    await this.sendMessageAsync(_chatId, message)
  }
} 