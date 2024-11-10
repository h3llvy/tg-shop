import axios from 'axios'
import type { IGiftHistory } from '../types/giftHistory'

class GiftHistoryService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/gifts`

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Telegram-Web-App-Init-Data': window.Telegram?.WebApp?.initData || ''
    }
  }

  public async getGiftHistoryAsync(giftId: string): Promise<IGiftHistory[]> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/${giftId}/history`, {
        headers: this.getHeaders(),
        withCredentials: true
      })
      return data
    } catch (error) {
      console.error('Ошибка получения истории подарка:', error)
      throw new Error('Не удалось загрузить историю подарка')
    }
  }
}

export const giftHistoryService = new GiftHistoryService() 