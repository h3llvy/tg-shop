import axios from 'axios'
import type { IGift } from '../types/gift'

class GiftService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/gifts`

  public async getAllGiftsAsync(): Promise<IGift[]> {
    try {
      const { data } = await axios.get(this.baseUrl)
      return data.map(this.mapGiftResponse)
    } catch (error) {
      console.error('Ошибка получения подарков:', error)
      throw error
    }
  }

  public async getGiftByIdAsync(id: string): Promise<IGift> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/${id}`)
      return this.mapGiftResponse(data)
    } catch (error) {
      console.error('Ошибка получения подарка:', error)
      throw error
    }
  }

  private mapGiftResponse(gift: any): IGift {
    return {
      _id: gift._id,
      name: gift.name,
      description: gift.description,
      image: gift.image,
      prices: gift.prices,
      category: gift.category,
      rarity: gift.rarity,
      availableQuantity: gift.availableQuantity,
      soldCount: gift.soldCount || 0,
      isAvailable: gift.isAvailable,
      bgColor: gift.bgColor
    }
  }
}

export const giftService = new GiftService()