import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../core/services/loggerService'

const logger = new LoggerService()

export const inlineAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Проверяем, что запрос идет от бота (по специальному префиксу в ID подарка)
    const giftId = req.params.id
    const userAgent = req.headers['user-agent']
    
    // Пропускаем запросы от бота или с префиксом gift_
    if (giftId?.startsWith('gift_') || userAgent?.includes('axios')) {
      logger.logInfo('Пропускаем авторизацию для inline запроса:', { giftId, userAgent })
      return next()
    }

    // Для обычных запросов проверяем данные инициализации
    const initData = req.headers['telegram-web-app-init-data']
    if (!initData || typeof initData !== 'string') {
      logger.logWarning('Отсутствуют данные инициализации')
      res.status(401).json({ error: 'Отсутствуют данные инициализации' })
      return
    }

    next()
  } catch (error) {
    logger.logError('Ошибка авторизации:', error)
    res.status(401).json({ error: 'Ошибка авторизации' })
  }
} 