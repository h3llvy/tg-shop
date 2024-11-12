import { Request, Response } from 'express'
import { UserRepository } from '../../database/repositories/userRepository'
import { LoggerService } from '../../core/services/loggerService'
import { UserService } from '../services/userService'

export class UserController {
  private readonly p_userRepository: UserRepository
  private readonly p_logger: LoggerService
  private readonly p_userService: UserService

  constructor() {
    this.p_userRepository = new UserRepository()
    this.p_logger = new LoggerService()
    this.p_userService = new UserService()
  }

  public async createUserAsync(req: Request, res: Response): Promise<void> {
    try {
      console.log('Получен запрос на создание пользователя:', req.body);
      const { telegramId } = req.body

      let user = await this.p_userRepository.findByTelegramIdAsync(telegramId)

      if (!user) {
        user = await this.p_userRepository.createAsync(req.body)
        this.p_logger.logInfo('Создан новый пользователь:', { telegramId })
      } else {
        user = await this.p_userRepository.updateAsync(telegramId, {
          ...req.body,
          lastActive: new Date()
        })
        this.p_logger.logInfo('Обновлен пользователь:', { telegramId })
      }

      res.json(user)
    } catch (error) {
      this.p_logger.logError('Ошибка создания/обновления пользователя:', error)
      res.status(500).json({ error: 'Внутренняя ошибка сервера' })
    }
  }

  public async getUserAvatarAsync(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId)
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' })
        return
      }

      const avatarUrl = await this.p_userService.getUserAvatarAsync(userId)
      res.json(avatarUrl)
    } catch (error) {
      this.p_logger.logError('Ошибка получения аватара:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
