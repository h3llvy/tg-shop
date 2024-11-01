import express from 'express'
import cors from 'cors'
import { giftRoutes } from './modules/gifts'
import { userRoutes } from './modules/users'
import { webhookRoutes } from './modules/telegram'
import { authRoutes } from './modules/auth'
import { paymentRoutes } from './modules/payment'

const app = express()

const ALLOWED_ORIGINS = [
  'https://local-tuna-client.ru.tuna.am',
  'http://localhost:3000',
  'https://local-tuna-server.ru.tuna.am',

   // Production
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

app.get('/', (_req, res) => {
  res.json({ message: 'Gift Shop API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/users', userRoutes)
app.use('/api/webhook', webhookRoutes)
app.use('/api/payment', paymentRoutes)

export { app }