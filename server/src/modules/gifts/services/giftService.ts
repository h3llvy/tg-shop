import type { IGift } from '../types/gift'
import { Gift } from '../../database/models/Gift'
import { GiftHistory } from '../../database/models/GiftHistory'
import { LoggerService } from '../../core/services/loggerService'

export class GiftService {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async getAllAsync(): Promise<IGift[]> {
    try {
      return await Gift.find()
    } catch (error) {
      this.p_logger.logError('Ошибка при получении подарков:', error)
      throw error
    }
  }

  public async getByIdAsync(_id: string): Promise<IGift | null> {
    try {
      return await Gift.findById(_id)
    } catch (error) {
      this.p_logger.logError('Ошибка при получении подарка:', error)
      throw error
    }
  }

  public async purchaseAsync(_giftId: string, _userId: string): Promise<IGift> {
    try {
      const gift = await Gift.findById(_giftId)
      if (!gift) {
        throw new Error('Подарок не найден')
      }

      if (!gift.isAvailable || gift.availableQuantity <= 0) {
        throw new Error('Подарок недоступен для покупки')
      }

      gift.soldCount += 1
      
      // Записываем историю
      await GiftHistory.create({
        giftId: gift._id,
        userId: Number(_userId),
        action: 'buy'
      })
      
      return await gift.save()
    } catch (error) {
      this.p_logger.logError('Ошибка при покупке подарка:', error)
      throw error
    }
  }

  public async sendAsync(_giftId: string, _userId: string, _recipientId: string): Promise<IGift> {
    try {
      const gift = await Gift.findById(_giftId)
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
      this.p_logger.logError('Ошибка при отправке подарка:', error)
      throw error
    }
  }
}
