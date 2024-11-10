import { Router } from 'express'
import { GiftController } from '../controllers/giftController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new GiftController()

router.get('/my', authMiddleware, controller.getUserGiftsAsync)
router.get('/', controller.getAllAsync)
router.get('/:id/history', controller.getGiftHistoryAsync)
router.get('/:id', controller.getGiftByIdAsync)

export { router as giftRoutes }
