import { Request, Response, NextFunction } from 'express'
import { validate } from '@telegram-apps/init-data-node'
import { config } from '../../../config'
import { LoggerService } from '../../core/services/loggerService'

const logger = new LoggerService()

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const initData = req.headers['telegram-web-app-init-data']
    
    if (!initData || typeof initData !== 'string') {
      logger.logWarning('Отсутствуют данные инициализации', { 
        headers: req.headers 
      })
      res.status(401).json({ error: 'Отсутствуют данные инициализации' })
      return
    }

    logger.logInfo('Получены данные инициализации:', { initData })

    // Парсим данные пользователя
    const params = new URLSearchParams(initData)
    const userStr = params.get('user')
    const hash = params.get('hash')
    const authDate = params.get('auth_date')
    
    if (!userStr || !hash || !authDate) {
      logger.logWarning('Неполные данные инициализации', { 
        hasUser: !!userStr,
        hasHash: !!hash,
        hasAuthDate: !!authDate
      })
      res.status(401).json({ error: 'Неполные данные инициализации' })
      return
    }

    // Проверяем подпись
    const isValid = validate(initData, config.BOT_TOKEN)
    if (!isValid) {
      logger.logWarning('Неверная подпись', { hash })
      res.status(401).json({ error: 'Неверная подпись' })
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
