import { Router } from 'express'
import { GiftController } from './controllers/giftController'
import { telegramAuthMiddleware } from '../auth/middleware/telegramAuthMiddleware'

const router = Router()
const controller = new GiftController()

router.get('/', telegramAuthMiddleware, (req, res, next) => {
  controller.getGiftsAsync(req, res).catch(next)
})

router.get('/:id', telegramAuthMiddleware, (req, res, next) => {
  controller.getGiftByIdAsync(req, res).catch(next)
})

export const giftRoutes = router