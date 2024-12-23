import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import type { IAuthResponse } from '../types/auth'

export class AuthController {
  private readonly p_authService: AuthService

  constructor() {
    this.p_authService = new AuthService()
  }

  public async loginAsync(req: Request, res: Response): Promise<void> {
    try {
      const { initData } = req.body

      console.log('Полученные данные initData:', initData)

      if (!initData) {
        res.status(400).json({ error: 'Отсутствуют данные инициализации' })
        return
      }

      const isValid = await this.p_authService.validateInitDataAsync(initData)
      console.log('Результат валидации:', isValid)

      if (!isValid) {
        res.status(401).json({ error: 'Неверные данные инициализации' })
        return
      }

      await this.p_authService.authenticateUserAsync(initData)

      const userData = this.p_authService.parseUserData(initData)
      if (!userData) {
        res.status(400).json({ error: 'Не удалось получить данные пользователя' })
        return
      }

      const token = this.p_authService.generateToken(userData.id)
      const response: IAuthResponse = { token, user: userData }

      res.json(response)
    } catch (error) {
      console.error('Детали ошибки авторизации:', error)
      res.status(500).json({ error: 'Внутренняя ошибка сервера' })
    }
  }
}
