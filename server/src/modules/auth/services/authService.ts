import { validate } from '@telegram-apps/init-data-node'
import jwt from 'jsonwebtoken'
import type { IAuthUser } from '../types/auth'

export class AuthService {
  private readonly p_jwtSecret: string
  private readonly p_botToken: string

  constructor() {
    this.p_jwtSecret = process.env.JWT_SECRET || 'secret'
    this.p_botToken = process.env.BOT_TOKEN || ''
  }

  public async validateInitDataAsync(_initData: string): Promise<boolean> {
    try {
      validate(_initData, this.p_botToken)
      return true
    } catch (error) {
      console.error('Неверные данные инициализации:', error)
      return false
    }
  }

  public generateToken(_userId: number): string {
    return jwt.sign({ userId: _userId }, this.p_jwtSecret, { expiresIn: '24h' })
  }

  public parseUserData(_initData: string): IAuthUser | null {
    try {
      const userParam = _initData
        .split('&')
        .find((param) => param.startsWith('user='))
      
      if (!userParam) return null

      const userData = JSON.parse(
        decodeURIComponent(userParam.split('=')[1])
      )

      return userData
    } catch (error) {
      console.error('Ошибка парсинга данных пользователя:', error)
      return null
    }
  }
}
