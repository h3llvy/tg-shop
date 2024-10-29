import type { IGift } from '../types/gift'
import { GiftModel } from '../models/Gift'

export class GiftService {
  public async getAllAsync(): Promise<IGift[]> {
    try {
      return await GiftModel.find()
    } catch (error) {
      console.error('Ошибка при получении подарков:', error)
      throw error
    }
  }

  public async getByIdAsync(_id: string): Promise<IGift | null> {
    try {
      return await GiftModel.findById(_id)
    } catch (error) {
      console.error('Ошибка при получении подарка:', error)
      throw error
    }
  }

  public async purchaseAsync(_giftId: string, _userId: string): Promise<IGift> {
    try {
      const gift = await GiftModel.findById(_giftId)
      if (!gift) {
        throw new Error('Подарок не найден')
      }

      if (gift.status !== 'available') {
        throw new Error('Подарок недоступен для покупки')
      }

      gift.status = 'purchased'
      gift.owner = _userId as any // Временное решение, пока нет модели User
      
      return await gift.save()
    } catch (error) {
      console.error('Ошибка при покупке подарка:', error)
      throw error
    }
  }

  public async sendAsync(_giftId: string, _userId: string, _recipientId: string): Promise<IGift> {
    try {
      const gift = await GiftModel.findById(_giftId)
      if (!gift) {
        throw new Error('Подарок не найден')
      }

      if (gift.status !== 'purchased') {
        throw new Error('Подарок не куплен')
      }

      if (gift.owner?.toString() !== _userId) {
        throw new Error('Нет прав на отправку подарка')
      }

      gift.status = 'gifted'
      gift.recipient = _recipientId as any // Временное решение, пока нет модели User
      
      return await gift.save()
    } catch (error) {
      console.error('Ошибка при отправке подарка:', error)
      throw error
    }
  }
}
