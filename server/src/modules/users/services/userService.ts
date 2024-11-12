import { TelegramService } from './telegramService'
import { LoggerService } from '../../core/services/loggerService'
import type { IUserAvatar, IUserResponse } from '../types/user'
import { User } from '../../database/models'
import { UserGift } from '../../database/models'
import type { IUserGift } from '@/modules/gifts/types/userGift'

export class UserService {
  private readonly p_telegramService: TelegramService
  private readonly p_logger: LoggerService

  constructor() {
    this.p_telegramService = new TelegramService()
    this.p_logger = new LoggerService()
  }

  public async getUserAvatarAsync(_userId: number): Promise<string | null> {
    try {
      // Проверяем существование пользователя
      const user = await User.findOne({ telegramId: _userId })
      if (!user) {
        this.p_logger.logInfo('Пользователь не найден:', { userId: _userId })
        return null
      }

      // Если у пользователя есть кэшированная аватарка и она не устарела
      if (user.avatar?.url && !this.isAvatarOutdated(user.avatar.lastUpdated)) {
        this.p_logger.logInfo('Возвращаем кэшированную аватарку:', { 
          userId: _userId,
          url: user.avatar.url 
        })
        return user.avatar.url
      }

      // Пытаемся получить новую аватарку
      const avatarUrl = await this.p_telegramService.getUserAvatarUrlAsync(_userId)
      
      if (avatarUrl) {
        // Обновляем аватарку в базе
        await User.updateOne(
          { telegramId: _userId },
          { 
            $set: {
              'avatar.url': avatarUrl,
              'avatar.lastUpdated': new Date()
            }
          }
        )
        this.p_logger.logInfo('Обновлена аватарка пользователя:', {
          userId: _userId,
          url: avatarUrl
        })
        return avatarUrl
      }

      return null
    } catch (error) {
      this.p_logger.logError('Ошибка получения аватара:', error)
      return null
    }
  }

  private isAvatarOutdated(lastUpdated?: Date): boolean {
    if (!lastUpdated) return true
    
    const now = new Date().getTime()
    const lastUpdate = new Date(lastUpdated).getTime()
    const dayInMs = 24 * 60 * 60 * 1000
    
    return now - lastUpdate > dayInMs
  }

  public async getUserProfileAsync(_userId: number): Promise<IUserResponse> {
    try {
      const avatarUrl = await this.p_telegramService.getUserAvatarUrlAsync(_userId)
      return {
        avatarUrl: avatarUrl || ''
      }
    } catch (error) {
      this.p_logger.logError('Ошибка получения профиля:', error)
      return {
        avatarUrl: ''
      }
    }
  }

  public async getOrUpdateAvatarAsync(_userId: number): Promise<string | null> {
    try {
      const user = await User.findOne({ telegramId: _userId })
      if (!user) return null

      // Если аватарка есть и на обновлялась менее суток назад - возвращаем её
      if (user.avatar?.url && user.avatar.lastUpdated) {
        const lastUpdate = new Date(user.avatar.lastUpdated).getTime()
        const now = new Date().getTime()
        const dayInMs = 24 * 60 * 60 * 1000

        if (now - lastUpdate < dayInMs) {
          return user.avatar.url
        }
      }

      // Иначе запрашиваем новую
      return await this.p_telegramService.getUserAvatarUrlAsync(_userId)
    } catch (error) {
      this.p_logger.logError('Ошибка получения/обновления аватара:', error)
      return null
    }
  }

  public async getUserProfileWithGiftsAsync(_userId: number): Promise<{
    profile: IUser,
    gifts: IUserGift[]
  }> {
    try {
      // Получаем профиль пользователя
      const user = await User.findOne({ telegramId: _userId })
      if (!user) {
        throw new Error('Пользователь не найден')
      }

      // Получаем подарки пользователя с полной информацией
      const gifts = await UserGift.find({ userId: _userId })
        .populate({
          path: 'giftId',
          model: 'Gift',
          select: 'name description image prices isAvailable availableQuantity soldCount status rarity category bgColor'
        })
        .sort({ purchaseDate: -1 })
        .lean()

      return {
        profile: user,
        gifts: gifts.map(gift => ({
          ...gift,
          _id: gift._id.toString(),
          gift: {
            ...gift.giftId,
            _id: gift.giftId._id.toString()
          }
        }))
      }
    } catch (error) {
      this.p_logger.logError('Ошибка получения профиля с подарками:', error)
      throw error
    }
  }

  public async getUserGiftsHistoryAsync(_userId: number): Promise<IUserGift[]> {
    try {
      const gifts = await UserGift.find({
        $or: [
          { userId: _userId },
          { recipientId: _userId }
        ]
      })
      .populate({
        path: 'giftId',
        model: 'Gift',
        select: 'name description image prices isAvailable availableQuantity soldCount status rarity category bgColor'
      })
      .sort({ purchaseDate: -1 })
      .lean()

      // Преобразуем данные в нужный формат
      return gifts.map(gift => ({
        ...gift,
        _id: gift._id.toString(),
        gift: {
          ...gift.giftId,
          _id: gift.giftId._id.toString()
        }
      }))
    } catch (error) {
      this.p_logger.logError('Ошибка получения истории подарков:', error)
      throw error
    }
  }
}
