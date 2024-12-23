interface IConfig {
  PORT: number
  HOST: string
  MONGODB_URI: string
  BOT_TOKEN: string
  CRYPTO_PAY_API_TOKEN: string
  JWT_SECRET: string
  WEBAPP_URL: string
  PUBLIC_URL: string
  WEBHOOK_DOMAIN: string
  WEBHOOK_PATH: string
  SUPPORT_CHAT_ID: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_PASSWORD: string
  CORS_ORIGIN: string
  NODE_ENV: 'development' | 'production'
  MONGODB_LOG_LEVEL: string
  MONGOOSE_DEBUG: boolean
  BOT_NAME: string
  SERVER_URL: string
}
import 'dotenv/config'

console.log(process.env.CORS_ORIGIN)
const config: IConfig = {
  PORT: Number(process.env.PORT) || 4000,
  HOST: process.env.HOST || '0.0.0.0',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/giftshop',
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  CRYPTO_PAY_API_TOKEN: process.env.CRYPTO_PAY_API_TOKEN || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  WEBAPP_URL: process.env.WEBAPP_URL || 'https://local-tuna-client.ru.tuna.am',
  PUBLIC_URL: process.env.PUBLIC_URL || 'https://local-tuna-server.ru.tuna.am',
  WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN || 'https://local-tuna-server.ru.tuna.am',
  WEBHOOK_PATH: process.env.WEBHOOK_PATH || '/api/telegram/webhook',
  SUPPORT_CHAT_ID: process.env.SUPPORT_CHAT_ID || '',
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://local-tuna-client.ru.tuna.am',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  MONGODB_LOG_LEVEL: process.env.MONGODB_LOG_LEVEL || 'error',
  MONGOOSE_DEBUG: process.env.MONGOOSE_DEBUG === 'true',
  BOT_NAME: process.env.BOT_NAME || 'Gift Shop Bot',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:4000'
}

// Проверяем обязательные переменные только если это не скрипт
const isScript = process.argv[1]?.includes('scripts/')
if (!isScript) {
  const requiredVars = [
    'BOT_TOKEN',
    'CRYPTO_PAY_API_TOKEN',
    'MONGODB_URI',
    'REDIS_PASSWORD'
  ]

  const missingVars = requiredVars.filter(varName => !config[varName as keyof IConfig])

  if (missingVars.length > 0) {
    throw new Error(`Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`)
  }
}

export { config } 