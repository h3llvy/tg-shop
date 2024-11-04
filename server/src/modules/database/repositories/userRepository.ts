import type { IUser } from '../types/user'
import { User } from '../models/User'
import { LoggerService } from '../../core/services/loggerService'

export class UserRepository {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async findByTelegramIdAsync(_telegramId: number): Promise<IUser | null> {
    try {
      return await User.findOne({ telegramId: _telegramId })
    } catch (error) {
      this.p_logger.logError('Ошибка поиска пользователя:', error)
      throw error
    }
  }

  public async createAsync(_userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.create(_userData)
      this.p_logger.logInfo('Создан новый пользователь:', { telegramId: user.telegramId })
      return user
    } catch (error) {
      this.p_logger.logError('Ошибка создания пользователя:', error)
      throw error
    }
  }

  public async updateAsync(_telegramId: number, _update: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { telegramId: _telegramId },
        { ..._update, updatedAt: new Date() },
        { new: true }
      )
    } catch (error) {
      this.p_logger.logError('Ошибка обновления пользователя:', error)
      throw error
    }
  }
} 