import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../core/services/loggerService'

const logger = new LoggerService()

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const initData = req.headers['telegram-web-app-init-data']
    
    if (!initData || typeof initData !== 'string') {
      logger.logWarning('Отсутствуют данные инициализации')
      res.status(401).json({ error: 'Отсутствуют данные инициализации' })
      return
    }

    // Парсим данные пользователя
    const params = new URLSearchParams(initData)
    const userStr = params.get('user')
    
    if (!userStr) {
      logger.logWarning('Отсутствуют данные пользователя')
      res.status(401).json({ error: 'Отсутствуют данные пользователя' })
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userStr))
      req.user = user
      next()
    } catch (error) {
      logger.logError('Ошибка парсинга данных пользователя:', error)
      res.status(401).json({ error: 'Некорректные данные пользователя' })
    }
  } catch (error) {
    logger.logError('Ошибка авторизации:', error)
    res.status(401).json({ error: 'Ошибка авторизации' })
  }
}

// Расширяем типы для Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        first_name: string
        last_name?: string
        username?: string
        language_code?: string
      }
    }
  }
}
