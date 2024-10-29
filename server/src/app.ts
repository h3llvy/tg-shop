import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { giftRoutes } from './modules/gifts'
import { userRoutes } from './modules/users'
import { webhookRoutes } from './modules/telegram'
import { authRoutes } from './modules/auth'
import { paymentRoutes } from './modules/payment'

const app = express()

const ALLOWED_ORIGINS = [
  'https://local-tuna-client.ru.tuna.am',
  'http://localhost:3000',
  'https://local-tuna-server.ru.tuna.am'
]

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

const initDatabaseAsync = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Запуск в режиме разработки без базы данных')
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '')
    console.log('База данных подключена')
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error)
    process.exit(1)
  }
}

app.get('/', (_req, res) => {
  res.json({ message: 'Gift Shop API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/users', userRoutes)
app.use('/api/telegram', webhookRoutes)
app.use('/api/payments', paymentRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Ошибка сервера:', err)
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

export { app, initDatabaseAsync }
