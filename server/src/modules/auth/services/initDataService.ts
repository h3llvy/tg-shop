import { validate, sign, isValid } from '@telegram-apps/init-data-node'
import type { IInitDataPayload } from '../types/auth'

export class InitDataService {
  private readonly p_botToken: string

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      throw new Error('Не задан TELEGRAM_BOT_TOKEN')
    }
    this.p_botToken = token
  }

  public async validateInitDataAsync(_initData: string): Promise<boolean> {
    try {
      validate(_initData, this.p_botToken)
      return true
    } catch (error) {
      console.error('Неверные данные инициализации:', error)
      return false
    }
  }

  public isValidInitData(_initData: string): boolean {
    return isValid(_initData, this.p_botToken)
  }

  public async createInitDataAsync(_payload: IInitDataPayload): Promise<string> {
    const signData = {
      user: _payload.user ? {
        id: _payload.user.id,
        firstName: _payload.user.first_name,
        lastName: _payload.user.last_name,
        username: _payload.user.username,
        languageCode: _payload.user.language_code
      } : undefined,
      chatInstance: _payload.chat_instance,
      startParam: _payload.start_param
    }

    return sign(signData, this.p_botToken, new Date())
  }
}
