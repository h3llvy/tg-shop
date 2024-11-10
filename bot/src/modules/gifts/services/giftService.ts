import axios from 'axios'
import { IGift } from '../types/gift'

export class GiftService {
  private readonly apiUrl: string

  constructor() {
    this.apiUrl = process.env.SERVER_URL || ''
  }

  public async getGiftByIdAsync(giftId: string): Promise<IGift | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/gifts/${giftId}`)
      return response.data
    } catch (error) {
      console.error('Ошибка получения подарка:', error)
      return null
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