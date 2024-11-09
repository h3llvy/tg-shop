import express, { Express } from 'express'
import cors from 'cors'
import { giftRoutes } from './modules/gifts'
import { userRoutes } from './modules/users/routes/userRoutes'
import { webhookRoutes } from './modules/telegram'
import { authRoutes } from './modules/auth'
import { paymentRoutes } from './modules/payment'
import { leaderboardRoutes } from './modules/leaderboard/routes/leaderboardRoutes'
import { LoggerService } from './modules/core/services/loggerService'
import { errorMiddleware } from './modules/core/middleware/errorMiddleware'

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
      callback(new Error('Not allowed by CORS'))
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
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}))

app.use(express.json())

// Маршруты
app.use('/api/auth', authRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/users', userRoutes)
app.use('/api/webhook', webhookRoutes)
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