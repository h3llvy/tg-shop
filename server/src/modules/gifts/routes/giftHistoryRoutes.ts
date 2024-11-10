import { Router } from 'express'
import { GiftController } from '../controllers/giftController'

const router = Router({ mergeParams: true })
const controller = new GiftController()

router.get('/', controller.getGiftHistoryAsync.bind(controller))

export { router as giftHistoryRoutes } 