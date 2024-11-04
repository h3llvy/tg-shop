import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'
import type { IUser } from '../../../types/user'
import { Bot } from 'grammy'
import { config } from '../../../config'

export class UserService {
  private readonly p_bot: Bot
  private readonly p_logger: LoggerService

  constructor() {
    this.p_bot = new Bot(config.BOT_TOKEN)
    this.p_logger = new LoggerService()
  }

  public async getUserAsync(_telegramId: number): Promise<IUser | null> {
    try {
      const { data } = await apiService.get(`/api/users/${_telegramId}`)
      return data
    } catch (error) {
      this.p_logger.logError('Ошибка получения пользователя:', error)
      return null
    }
  }

  public async updateUserAsync(_telegramId: number, _update: Partial<IUser>): Promise<IUser | null> {
    try {
      const { data } = await apiService.patch(`/api/users/${_telegramId}`, _update)
      return data
    } catch (error) {
      this.p_logger.logError('Ошибка обновления пользователя:', error)
      return null
    }
  }

  public async incrementGiftsReceivedAsync(_telegramId: number): Promise<void> {
    try {
      await apiService.post(`/api/users/${_telegramId}/gifts/received`)
    } catch (error) {
      this.p_logger.logError('Ошибка инкремента полученных подарков:', error)
    }
  }

  public async incrementGiftsSentAsync(_telegramId: number): Promise<void> {
    try {
      await apiService.post(`/api/users/${_telegramId}/gifts/sent`)
    } catch (error) {
      this.p_logger.logError('Ошибка инкремента отправленных подарков:', error)
    }
  }

  public async getUserAvatarUrlAsync(_userId: number): Promise<string | null> {
    try {
      // Получаем фотографии профиля
      const photos = await this.p_bot.api.getUserProfilePhotos(_userId, { limit: 1 })
      
      if (!photos || !photos.total_count || !photos.photos.length) {
        return null
      }

      // Получаем информацию о файле
      const fileId = photos.photos[0][0].file_id
      const file = await this.p_bot.api.getFile(fileId)

      if (!file.file_path) {
        return null
      }

      // Формируем URL для загрузки
      return `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`
    } catch (error) {
      this.p_logger.logError('Ошибка получения аватара:', error)
      return null
    }
  }
} 