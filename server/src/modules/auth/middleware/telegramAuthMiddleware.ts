import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { LoggerService } from '../../core/services/loggerService'

const logger = new LoggerService()

export const telegramAuthMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const initData = req.headers['telegram-web-app-init-data'] as string
    if (!initData) {
      logger.logWarning('Отсутствуют данные инициализации')
      res.status(401).json({ error: 'Отсутствуют данные инициализации' })
      return
    }

    // Парсим данные
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    const userData = JSON.parse(decodeURIComponent(urlParams.get('user') || '{}'))

    // Добавляем пользователя в request
    req.user = userData

    // Проверяем подпись только в production
    if (process.env.NODE_ENV === 'production') {
      // Создаем проверочный хэш
      const secret = crypto
        .createHmac('sha256', 'WebAppData')
        .update(process.env.BOT_TOKEN || '')
        .digest()

      urlParams.delete('hash')
      const checkString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

      const signature = crypto
        .createHmac('sha256', secret)
        .update(checkString)
        .digest('hex')

      if (signature !== hash) {
        logger.logWarning('Неверная подпись', { signature, hash })
        res.status(401).json({ error: 'Неверная подпись' })
        return
      }
    }

    next()
  } catch (error) {
    logger.logError('Ошибка проверки авторизации:', error)
    res.status(401).json({ error: 'Ошибка проверки авторизации' })
  }
} 