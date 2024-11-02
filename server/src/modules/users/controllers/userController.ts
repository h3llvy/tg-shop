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
      console.log('Получен запрос на загрузку аватара для пользователя:', userId)
      
      if (!userId) {
        console.log('ID пользователя не указан в запросе')
        res.status(400).json({ error: 'Не указан ID пользователя' })
        return
      }
  
      console.log('Запрос аватара из UserService...')
      const { avatarUrl } = await this.p_userService.getUserAvatarAsync(userId)
      console.log('Получен ответ от UserService:', { avatarUrl })
      
      if (!avatarUrl) {
        console.log('Аватар не найден для пользователя:', userId)
        res.status(404).json({ error: 'Аватар не найден' })
        return
      }
  
      console.log('Успешно отправлен аватар для пользователя:', userId)
      res.json({ avatarUrl })
    } catch (error) {
      console.error('Ошибка при получении аватара:', error)
      res.status(500).json({ error: 'Не удалось получить аватар' })
    }
  }
}
