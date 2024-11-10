import 'module-alias/register'
import 'dotenv/config'
import { createServer } from 'http'
import { app } from './app'
import { DatabaseService } from './modules/database/services/databaseService'
import { WebSocketService } from './modules/websocket/services/websocketService'

const PORT = Number(process.env.PORT) || 4000
const HOST = process.env.HOST || '0.0.0.0'

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

// Сначала проверяем переменные окружения
validateEnvVariables()

// Затем запускаем сервер
async function startServerAsync() {
  try {
    await DatabaseService.getInstance().connectAsync()

    // Создаем HTTP сервер
    const httpServer = createServer(app)
    
    // Инициализируем WebSocket
    const wsService = WebSocketService.getInstance()
    wsService.initialize(httpServer)
    
    // Используем httpServer.listen вместо app.listen
    httpServer.listen(PORT, HOST, () => {
      console.log(`🚀 Сервер запущен на http://${HOST}:${PORT}`)
      console.log(`🔌 WebSocket сервер запущен на ws://${HOST}:${PORT}/ws`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

startServerAsync()