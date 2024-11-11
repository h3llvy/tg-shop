import path from 'path'
import axios from 'axios'
import { LoggerService } from '../services/loggerService'

const logger = new LoggerService()

// Получаем URL из переменных окружения
const STATIC_URL = `${process.env.PUBLIC_URL || 'https://local-tuna-server.ru.tuna.am'}/static`

// Конфигурация изображений
export const BOT_ASSETS = {
  // Используем /static/ вместо /assets/
  AVATAR_URL: `${STATIC_URL}/avatar.png`,
  FALLBACK_AVATAR_URL: 'https://telegram.org/img/t_logo.png',
  GIFT_IMAGES: {
    'Delicious Cake': `${STATIC_URL}/gifts/cake.png`,
    'Red Star': `${STATIC_URL}/gifts/red-star.png`,
    'Green Star': `${STATIC_URL}/gifts/green-star.png`,
    'Blue Star': `${STATIC_URL}/gifts/blue-star.png`
  },
  // Используем абсолютный путь для локального файла
  START_IMAGE: path.join(__dirname, '../../../../assets/botstart.png')
} as const

// Проверяем доступность изображения с дополнительными заголовками
const checkImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status === 200,
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'TelegramBot/1.0'
      }
    })
    
    const contentType = response.headers['content-type']
    const isImage = contentType?.startsWith('image/')
    const contentLength = response.headers['content-length']
    
    if (!isImage) {
      logger.logError('Неверный тип контента:', { 
        url, 
        contentType,
        contentLength 
      })
      return false
    }

    logger.logInfo('Изображение доступно:', { 
      url,
      contentType,
      size: contentLength
    })
    return true
  } catch (error: any) {
    logger.logError('Ошибка проверки изображения:', { 
      url, 
      error: error.message,
      code: error.code
    })
    return false
  }
}

// Проверяем все URL изображений при старте
const validateAssets = async () => {
  try {
    logger.logInfo('Начало проверки ассетов', {
      STATIC_URL
    })

    const results = await Promise.all([
      checkImageUrl(BOT_ASSETS.AVATAR_URL),
      ...Object.entries(BOT_ASSETS.GIFT_IMAGES).map(async ([name, url]) => {
        const isAvailable = await checkImageUrl(url)
        return { name, url, isAvailable }
      })
    ])

    const [avatarResult, ...giftResults] = results
    
    if (!avatarResult) {
      logger.logWarning('Аватар недоступен, будет использован запасной вариант:', {
        fallback: BOT_ASSETS.FALLBACK_AVATAR_URL
      })
    }

    const unavailableGifts = giftResults
      .filter(r => !r.isAvailable)
      .map(r => ({ name: r.name, url: r.url }))

    if (unavailableGifts.length > 0) {
      logger.logWarning('Недоступные изображения подарков:', unavailableGifts)
    } else {
      logger.logInfo('Все изображения подарков доступны')
    }
  } catch (error) {
    logger.logError('Ошибка валидации ассетов:', error)
  }
}

// Запускаем проверку при импорте модуля
validateAssets()
