import { api } from '@/shared/services/apiService'
import type { IGift } from '../types/gift'
import type { IUserGift } from '../types/userGift'

class GiftService {
  private readonly baseUrl = '/api/gifts'

  private mapGiftResponse = (gift: any): IGift => {
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

  private mapUserGiftResponse = (userGift: any): IUserGift => {
    return {
      _id: userGift._id,
      userId: userGift.userId,
      gift: this.mapGiftResponse(userGift.giftId || userGift.gift),
      purchaseDate: userGift.purchaseDate,
      status: userGift.status,
      recipientId: userGift.recipientId,
      sentDate: userGift.sentDate,
      serialNumber: userGift.serialNumber,
      totalAvailable: userGift.totalAvailable,
      purchasePrice: userGift.purchasePrice,
      purchaseAsset: userGift.purchaseAsset
    }
  }

  public async getAllGiftsAsync(): Promise<IGift[]> {
    try {
      const { data } = await api.get(this.baseUrl)
      return data.map(this.mapGiftResponse)
    } catch (error) {
      console.error('Ошибка получения подарков:', error)
      throw error
    }
  }

  public async getGiftByIdAsync(id: string): Promise<IGift> {
    try {
      const { data } = await api.get(`${this.baseUrl}/${id}`)
      return this.mapGiftResponse(data)
    } catch (error) {
      console.error('Ошибка получения подарка:', error)
      throw error
    }
  }

  public async getUserGiftsAsync(): Promise<IUserGift[]> {
    try {
      const { data } = await api.get(`${this.baseUrl}/my`)
      return data.map(this.mapUserGiftResponse)
    } catch (error) {
      console.error('Ошибка получения купленных подарков:', error)
      throw error
    }
  }

  public async getReceivedGiftsAsync(): Promise<IUserGift[]> {
    try {
      const { data } = await api.get(`${this.baseUrl}/received`)
      return data.map(this.mapUserGiftResponse)
    } catch (error) {
      console.error('Ошибка при получении полученных подарков:', error)
      throw error
    }
  }

  public async getPurchasedGiftsAsync(): Promise<IUserGift[]> {
    try {
      const { data } = await api.get('/api/users/mypurchasedgifts')
      return data.map(this.mapUserGiftResponse)
    } catch (error) {
      console.error('Ошибка получения купленных подарков:', error)
      throw error
    }
  }
}

export const giftService = new GiftService()