import { Router } from 'express'
import { GiftController } from './controllers/giftController'
import { telegramAuthMiddleware } from '../auth/middleware/telegramAuthMiddleware'
import { inlineAuthMiddleware } from '../auth/middleware/inlineAuthMiddleware'

const router = Router()
const controller = new GiftController()

router.get('/', telegramAuthMiddleware, (req, res, next) => {
  controller.getGiftsAsync(req, res).catch(next)
})

router.get('/:id', inlineAuthMiddleware, (req, res, next) => {
  controller.getByIdAsync(req, res).catch(next)
})

export const giftRoutes = router