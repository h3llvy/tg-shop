import express, { Express } from 'express'
import cors from 'cors'
import { giftRoutes } from './modules/gifts'
import { userRoutes } from './modules/users/routes/userRoutes'
import { webhookRoutes } from './modules/payment/routes/webhookRoutes'
import { authRoutes } from './modules/auth'
import { paymentRoutes } from './modules/payment'
import { leaderboardRoutes } from './modules/leaderboard/routes/leaderboardRoutes'
import { giftHistoryRoutes } from './modules/gifts/routes/giftHistoryRoutes'
import { LoggerService } from './modules/core/services/loggerService'
import { errorMiddleware } from './modules/core/middleware/errorMiddleware'
import path from 'path'
import fs from 'fs'

const app: Express = express()
const logger = new LoggerService()

// Middleware для логирования запросов
app.use((req, res, next) => {
  logger.logInfo(`${req.method} ${req.url}`, { 
    headers: req.headers,
    query: req.query,
    params: req.params 
  })
  next()
})

const ALLOWED_ORIGINS = [
  'https://local-tuna-client.ru.tuna.am',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://local-tuna-server.ru.tuna.am',
  'https://app.giftcrybot.ru',
  'https://api.giftcrybot.ru'
]

// Настраиваем CORS до всех остальных middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      logger.logWarning(`CORS ошибка: ${origin} не разрешен`)
      callback(new Error(`CORS ошибка: ${origin} не разрешен`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Telegram-Web-App-Init-Data',
    'Access-Control-Allow-Headers',
    'Origin',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Access-Control-Allow-Origin'],
  maxAge: 86400 // Кэширование preflight запросов на 24 часа
}))

app.options('*', cors()) // Включить предварительную проверку для всех маршрутов

app.use(express.json())


// Добавляем middleware для логирования запросов к статике
app.use('/static', (req, res, next) => {
  const fullPath = path.join(__dirname, '../static', req.path)
  
  logger.logInfo('Запрос статического файла:', {
    path: req.path,
    method: req.method,
    fullPath,
    exists: fs.existsSync(fullPath)
  })
  next()
})

// Настраиваем раздачу статических файлов
app.use('/static', express.static(path.join(__dirname, '../static'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  fallthrough: false, // Возвращать 404 если файл не найден
  index: false // Отключаем автоматическую отдачу index.html
}))

// Маршруты
app.use('/api/auth', authRoutes)
app.use('/api/gifts/:id/history', giftHistoryRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/users', userRoutes)
app.use('/api/crypto-pay', webhookRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Обработка ошибок должна быть после всех маршрутов
app.use(errorMiddleware)

// Обработка 404 должна быть последней
app.use((req, res) => {
  logger.logWarning(`404 - Маршрут не найден: ${req.url}`)
  res.status(404).json({ error: 'Маршрут не найден' })
})

export { app }