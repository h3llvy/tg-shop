import { Router } from 'express'
import { GiftController } from '../controllers/giftController'
import { telegramAuthMiddleware } from '../../auth/middleware/telegramAuthMiddleware'

const router = Router()
const controller = new GiftController()

// Получение всех подарков
router.get('/', telegramAuthMiddleware, (req, res, next) => {
  controller.getGiftsAsync(req, res).catch(next)
})

// Получение подарка по ID
router.get('/:id', telegramAuthMiddleware, (req, res, next) => {
  controller.getGiftByIdAsync(req, res).catch(next)
})

export { router as giftRoutes }
