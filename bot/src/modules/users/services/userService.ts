import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'
import type { IUser } from '../../../types/user'

export class UserService {
  private readonly p_logger: LoggerService

  constructor() {
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
} 