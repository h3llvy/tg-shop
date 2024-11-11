import axios from 'axios'
import type { IGift } from '../types/gift'
import { LoggerService } from '../../core/services/loggerService'

export class GiftService {
  private readonly apiUrl: string
  private readonly logger: LoggerService

  constructor() {
    this.apiUrl = process.env.SERVER_URL || ''
    this.logger = new LoggerService()
  }

  public async getGiftByIdAsync(giftId: string): Promise<IGift | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts/${giftId}`)
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка получения подарка:', error)
      return null
    }
  }

  public async getAllAsync(): Promise<IGift[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts`)
      return response.data
    } catch (error) {
      this.logger.logError('Ошибка получения списка подарков:', error)
      return []
    }
  }

  public async sendGiftAsync(
    giftId: string,
    fromUserId: string,
    toUserId: string
  ): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/gifts/send`, {
        giftId,
        fromUserId,
        toUserId
      })
      return response.data.success
    } catch (error) {
      console.error('Ошибка отправки подарка:', error)
      return false
    }
  }
}

export const giftService = new GiftService()