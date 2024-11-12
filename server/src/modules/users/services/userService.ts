import { TelegramService } from './telegramService'
import { LoggerService } from '../../core/services/loggerService'
import type { IUserAvatar, IUserResponse } from '../types/user'
import { User } from '../../database/models'

export class UserService {
  private readonly p_telegramService: TelegramService
  private readonly p_logger: LoggerService

  constructor() {
    this.p_telegramService = new TelegramService()
    this.p_logger = new LoggerService()
  }

  public async getUserAvatarAsync(_userId: number): Promise<IUserAvatar> {
    try {
      const avatarUrl = await this.p_telegramService.getUserAvatarUrlAsync(_userId)
      return {
        url: avatarUrl,
        avatarUrl: avatarUrl
      }
    } catch (error) {
      this.p_logger.logError('Ошибка получения аватара:', error)
      return {
        url: null,
        avatarUrl: null
      }
    }
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
}
