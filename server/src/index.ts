import 'dotenv/config'
import { app } from './app'
import { DatabaseService } from './modules/database/services/databaseService'

const PORT = Number(process.env.PORT) || 4000
const HOST = process.env.HOST || '0.0.0.0'

async function startServerAsync() {
  try {
    // Подключаем базы данных
    await DatabaseService.getInstance().connectAsync()

    // Запускаем сервер
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Сервер запущен на http://${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

startServerAsync()

function validateEnvVariables() {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'HOST',
    'BOT_TOKEN',
    'CRYPTO_PAY_API_TOKEN',
    'JWT_SECRET',
    'MONGODB_URI',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('Отсутствуют обязательные переменные окружения:', missingVars)
    process.exit(1)
  }

  console.log('Текущие переменные окружения:')
  requiredVars.forEach(varName => {
    console.log(`${varName}: ${process.env[varName]}`)
  })
}

validateEnvVariables()