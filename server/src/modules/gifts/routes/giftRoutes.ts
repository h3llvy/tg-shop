import { Router } from 'express'
import { GiftController } from '../controllers/giftController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new GiftController()

router.get('/', (req, res) => {
  controller.getGiftsAsync(req, res)
})

router.get('/:id', (req, res) => {
  controller.getGiftByIdAsync(req, res)
})

router.post('/:id/purchase', authMiddleware, (req, res) => {
  controller.purchaseGiftAsync(req, res)
})

router.post('/:id/send', authMiddleware, (req, res) => {
  controller.sendGiftAsync(req, res)
})

export { router as giftRoutes }
