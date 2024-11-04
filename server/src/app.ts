import express from 'express'
import cors from 'cors'
import { giftRoutes } from './modules/gifts'
import { userRoutes } from './modules/users/routes/userRoutes'
import { webhookRoutes } from './modules/telegram'
import { authRoutes } from './modules/auth'
import { paymentRoutes } from './modules/payment'
import { LoggerService } from './modules/core/services/loggerService'

const app = express()
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
  'http://localhost:5173', // Добавляем порт разработки Vite
  'https://local-tuna-server.ru.tuna.am',
  'https://app.giftcrybot.ru',
  'https://api.giftcrybot.ru'
]

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Маршруты
app.use('/api/auth', authRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/users', userRoutes)
app.use('/api/webhook', webhookRoutes)
app.use('/api/payment', paymentRoutes)

// Обработка 404
app.use((req, res) => {
  logger.logWarning(`404 - Маршрут не найден: ${req.url}`)
  res.status(404).json({ error: 'Маршрут не найден' })
})

export { app }