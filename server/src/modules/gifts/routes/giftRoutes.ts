import { Router } from 'express'
import { GiftController } from '../controllers/giftController'
import { inlineAuthMiddleware } from '../../auth/middleware/inlineAuthMiddleware'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new GiftController()

router.get('/my', authMiddleware, (req, res) => controller.getUserGiftsAsync(req, res))
router.get('/', (req, res) => controller.getGiftsAsync(req, res))
router.get('/:id/history', (req, res) => controller.getGiftHistoryAsync(req, res))
router.get('/:id', inlineAuthMiddleware, (req, res) => controller.getByIdAsync(req, res))

export { router as giftRoutes }
