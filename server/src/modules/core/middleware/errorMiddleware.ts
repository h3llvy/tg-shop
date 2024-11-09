import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { LoggerService } from '../services/loggerService'

const logger = new LoggerService()

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  logger.logError('Ошибка сервера:', err)

  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed'
    })
    return
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
  return
} 