import axios from 'axios'
import type { IGift } from '../types/gift'
import type { IUserGift } from '../types/userGift'
import { LoggerService } from '../../core/services/loggerService'

export class GiftService {
  private readonly apiUrl: string
  private readonly logger: LoggerService
  private readonly headers: Record<string, string>

  constructor() {
    this.apiUrl = process.env.SERVER_URL || ''
    this.logger = new LoggerService()
    this.headers = {
      'X-Telegram-Bot-Api-Secret-Token': process.env.BOT_TOKEN || '',
      'User-Agent': 'TelegramBot/1.0'
    }
  }

  public async getGiftByIdAsync(giftId: string): Promise<IGift | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts/${giftId}`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка получения подарка:', error)
      return null
    }
  }

  public async getAllAsync(): Promise<IGift[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка получения списка подарков:', error)
      return []
    }
  }

  public async getAllAvailableGiftsAsync(): Promise<IGift[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts?available=true`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка при получении доступных подарков:', error)
      return []
    }
  }

  public async getUserGiftAsync(giftId: string): Promise<IUserGift | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts/user/${giftId}`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка при получении подарка пользователя:', error)
      return null
    }
  }

  public async receiveGiftAsync(giftId: string, userId: number): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/gifts/${giftId}/receive`, { userId }, {
        headers: this.headers
      })
    } catch (error) {
      this.logger.logError('Ошибка при получении подарка:', error)
      throw error
    }
  }

  public async sendGiftAsync(
    giftId: string,
    fromUserId: number,
    toUserId: number,
    message?: string
  ): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/gifts/${giftId}/send`, {
        fromUserId,
        toUserId,
        message
      }, {
        headers: this.headers
      })
    } catch (error) {
      this.logger.logError('Ошибка при отправке подарка:', error)
      throw error
    }
  }

  public async getUserGiftsAsync(userId: number): Promise<IUserGift[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts/my`, {
        headers: {
          ...this.headers,
          'X-User-Id': String(userId)
        }
      })
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка при получении подарков пользователя:', error)
      return []
    }
  }
}

export const giftService = new GiftService()