import type { IGift } from '../types/gift'
import { Gift } from '../../database/models/Gift'
import { GiftHistory, GiftHistoryAction } from '../../database/models/GiftHistory'
import { UserGift } from '../../database/models/UserGift'
import { LoggerService } from '../../core/services/loggerService'
import type { IUserGift } from '../../database/models/UserGift'
import mongoose from 'mongoose'
import { SentGift } from '../../database/models/SentGift'

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

  public async getByIdAsync(giftId: string): Promise<IGift | null> {
    try {
      const gift = await Gift.findById(giftId).lean()
      
      if (!gift) {
        this.p_logger.logWarning('Gift not found', { giftId })
        return null
      }

      // Проверяем обязательные поля
      if (!gift._id || !gift.name || !gift.prices) {
        this.p_logger.logError('Invalid gift data in database', { 
          giftId,
          hasId: !!gift._id,
          hasName: !!gift.name,
          hasPrices: !!gift.prices
        })
        return null
      }

      return gift
    } catch (error) {
      this.p_logger.logError('Error getting gift by ID:', error)
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
        giftId: _giftId,
        userId: Number(_userId),
        action: GiftHistoryAction.PURCHASE
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

  public async decrementAvailableQuantityAsync(_giftId: string, _userId?: number): Promise<void> {
    try {
      const result = await Gift.findByIdAndUpdate(
        _giftId,
        { 
          $inc: { 
            availableQuantity: -1,
            soldCount: 1 
          }
        },
        { 
          new: true,
          runValidators: false
        }
      )

      if (!result) {
        throw new Error('Подарок не найден')
      }

      if (result.availableQuantity < 0) {
        await Gift.findByIdAndUpdate(
          _giftId,
          { 
            $inc: { 
              availableQuantity: 1,
              soldCount: -1 
            }
          },
          { runValidators: false }
        )
        throw new Error('Подарок закончился')
      }

      this.p_logger.logInfo('Количество подарков уменьшено', { 
        giftId: _giftId,
        newQuantity: result.availableQuantity 
      })

      // Создаем запись в истории только если есть userId
      if (_userId) {
        await GiftHistory.create({
          giftId: _giftId,
          userId: _userId,
          action: GiftHistoryAction.PURCHASE
        })
      }

    } catch (error) {
      this.p_logger.logError('Ошибка уменьшения количества подарков:', error)
      throw error
    }
  }

  public async purchaseGiftAsync(giftId: string, userId: number): Promise<IGift> {
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
      const gift = await Gift.findById(giftId).session(session)
      if (!gift) {
        throw new Error('Подарок не найден')
      }

      if (!gift.isAvailable || gift.availableQuantity <= 0) {
        throw new Error('Подарок недоступен для покупки')
      }

      // Уменьшаем количество в одной транзакции
      gift.availableQuantity -= 1
      gift.soldCount += 1
      await gift.save({ session })

      // Создаем запись о покупке
      await UserGift.create([{
        userId,
        giftId: gift._id,
        status: 'purchased'
      }], { session })

      // Записываем в историю
      await GiftHistory.create({
        giftId: gift._id,
        userId,
        action: GiftHistoryAction.PURCHASE
      }, { session })

      await session.commitTransaction()
      return gift
    } catch (error) {
      await session.abortTransaction()
      this.p_logger.logError('Ошибка покупки подарка:', error)
      throw error
    } finally {
      session.endSession()
    }
  }

  public async getUserGiftsAsync(_userId: number): Promise<IUserGift[]> {
    try {
      return await UserGift.find({ userId: _userId })
        .populate('giftId')
        .sort({ purchaseDate: -1 })
        .lean()
    } catch (error) {
      this.p_logger.logError('Ошибка получения подарков пользователя:', error)
      throw error
    }
  }

  public async sendGiftAsync(giftId: string, senderId: number, recipientId: number): Promise<void> {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Проверяем наличие подарка у отправителя
      const userGift = await UserGift.findOne({ 
        userId: senderId,
        giftId,
        status: 'purchased'
      }).session(session)

      if (!userGift) {
        throw new Error('Gift not found or already sent')
      }

      // Помечаем подарок как отправленный
      userGift.status = 'sent'
      await userGift.save({ session })

      // Создаем запись об отправленном подарке
      await SentGift.create([{
        giftId,
        senderId,
        recipientId,
        status: 'sent'
      }], { session })

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
