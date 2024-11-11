import axios from 'axios'
import { LoggerService } from '../services/loggerService'
import type { IGift } from '../../gifts/types/gift'

const logger = new LoggerService()

// Конфигурация ассетов для бота
export const BOT_ASSETS = {
  // URL для статических файлов на сервере
  STATIC_URL: process.env.PUBLIC_URL || 'https://local-tuna-server.ru.tuna.am/static',
  
  // Локальные пути для команды start
  LOCAL_ASSETS: {
    START_IMAGE: './src/assets/botstart.png',
    FALLBACK_START_IMAGE: './src/assets/fallback.png'
  },
  
  // Пути к изображениям подарков для inline режима
  GIFT_IMAGES: {
    'Delicious Cake': '/gifts/cake.png',
    'Red Star': '/gifts/red-star.png',
    'Green Star': '/gifts/green-star.png',
    'Blue Star': '/gifts/blue-star.png'
  },
  
  // Путь к аватару по умолчанию
  DEFAULT_AVATAR: '/avatar.png'
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

// Добавим функцию проверки размера изображения
const checkImageSize = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url)
    const contentLength = parseInt(response.headers['content-length'] || '0')
    const maxSize = 1024 * 1024 // 1MB максимум
    
    if (contentLength > maxSize) {
      logger.logWarning('Изображение слишком большое:', {
        url,
        size: contentLength,
        maxSize
      })
      return false
    }
    return true
  } catch (error) {
    logger.logError('Ошибка проверки размера:', error)
    return false
  }
}

// Экспортируем функцию для использования в других модулях
export const getGiftImage = async (gift: IGift): Promise<string> => {
  const giftPath = BOT_ASSETS.GIFT_IMAGES[gift.name as keyof typeof BOT_ASSETS.GIFT_IMAGES]
  if (giftPath) {
    const fullUrl = `${BOT_ASSETS.STATIC_URL}${giftPath}`
    const isValidSize = await checkImageSize(fullUrl)
    
    if (isValidSize) {
      return fullUrl
    }
    logger.logWarning('Изображение не прошло проверку размера, использую запасной вариант')
  }
  
  return `${BOT_ASSETS.STATIC_URL}${BOT_ASSETS.DEFAULT_AVATAR}`
}

// Проверяем все URL изображений при старте
const validateAssets = async () => {
  try {
    logger.logInfo('Начало проверки ассетов', {
      staticUrl: BOT_ASSETS.STATIC_URL
    })

    const results = await Promise.all([
      checkImageUrl(`${BOT_ASSETS.STATIC_URL}${BOT_ASSETS.DEFAULT_AVATAR}`),
      ...Object.entries(BOT_ASSETS.GIFT_IMAGES).map(async ([name, imagePath]) => {
        const fullUrl = `${BOT_ASSETS.STATIC_URL}${imagePath}`
        const isAvailable = await checkImageUrl(fullUrl)
        return { name, url: fullUrl, isAvailable }
      })
    ])

    const [avatarResult, ...giftResults] = results
    
    if (!avatarResult) {
      logger.logWarning('Аватар недоступен, будет использован запасной вариант:', {
        fallback: `${BOT_ASSETS.STATIC_URL}${BOT_ASSETS.DEFAULT_AVATAR}`
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
