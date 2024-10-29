import { developmentConfig } from './environments/development'
import { productionConfig } from './environments/production'

interface IConfig {
  BOT_TOKEN: string
  WEBAPP_URL: string
  SERVER_URL: string
  WEBHOOK_DOMAIN: string
  WEBHOOK_PATH: string
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  enableWebhook: boolean
  enablePolling: boolean
  apiUrl: string
}

const getEnvironmentConfig = () => {
  return process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
}

export const config: IConfig = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  WEBAPP_URL: process.env.WEBAPP_URL || 'https://local-tuna-client.ru.tuna.am',
  SERVER_URL: process.env.SERVER_URL || 'https://local-tuna-server.ru.tuna.am',
  WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN || 'https://local-tuna-server.ru.tuna.am',
  WEBHOOK_PATH: process.env.WEBHOOK_PATH || '/api/telegram/webhook',
  ...getEnvironmentConfig()
}

if (!config.BOT_TOKEN) {
  throw new Error('Не задан BOT_TOKEN')
}
