import { Request, Response } from 'express'
import { UserService } from '../services/userService'

export class UserController {
  private readonly p_userService: UserService

  constructor() {
    this.p_userService = new UserService()
  }

  public async getUserAvatarAsync(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId)
      
      if (!userId) {
        res.status(400).json({ error: 'Не указан ID пользователя' })
        return
      }

      const { avatarUrl } = await this.p_userService.getUserAvatarAsync(userId)
      
      if (!avatarUrl) {
        res.status(404).json({ error: 'Аватар не найден' })
        return
      }

      res.json({ avatarUrl })
    } catch (error) {
      console.error('Ошибка при получении аватара:', error)
      res.status(500).json({ error: 'Не удалось получить аватар' })
    }
  }
}
