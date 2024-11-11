import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../core/services/loggerService'

const logger = new LoggerService()

export const inlineAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем, что запрос для inline режима
  const isInlineRequest = req.headers['x-telegram-bot-api-secret-token'] === process.env.BOT_TOKEN
  
  if (isInlineRequest) {
    logger.logInfo('Пропускаем авторизацию для inline запроса:', {
      userId: req.headers['x-user-id'],
      userAgent: req.headers['user-agent']
    })
    return next()
  }

  // Для обычных запросов требуем initData
  const initData = req.headers['telegram-web-app-init-data']
  if (!initData) {
    logger.logWarning('Отсутствуют данные инициализации')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
} 