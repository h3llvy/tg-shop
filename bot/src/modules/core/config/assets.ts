import path from 'path'
import axios from 'axios'
import fs from 'fs'
import { LoggerService } from '../services/loggerService'

const logger = new LoggerService()

export const BOT_ASSETS = {
  AVATAR_URL: `${process.env.SERVER_URL}/static/avatar.png`,
  START_IMAGE: path.join(__dirname, '../../../../assets/botstart.png')
} as const

// Проверяем локальные файлы
const files = [BOT_ASSETS.START_IMAGE]
files.forEach(file => {
  try {
    if (!fs.existsSync(file)) {
      logger.logError('Локальный файл не найден:', { path: file })
    } else {
      logger.logInfo('Локальный файл найден:', { path: file })
    }
  } catch (error: any) {
    logger.logError('Ошибка проверки файла:', { 
      path: file, 
      error: error.message 
    })
  }
})

// Проверяем доступность аватара через HTTP запрос
axios.get(BOT_ASSETS.AVATAR_URL, { method: 'HEAD' })
  .then(() => {
    logger.logInfo('Аватар доступен:', { url: BOT_ASSETS.AVATAR_URL })
  })
  .catch((error: Error) => {
    logger.logError('Аватар недоступен:', { 
      url: BOT_ASSETS.AVATAR_URL,
      error: error.message
    })
  })
