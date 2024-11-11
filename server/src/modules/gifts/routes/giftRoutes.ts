import { Router, Request, Response, NextFunction, RequestHandler } from 'express'
import { GiftController } from '../controllers/giftController'
import { inlineAuthMiddleware } from '../../auth/middleware/inlineAuthMiddleware'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new GiftController()

const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>): RequestHandler => {
  return async (req, res, next) => {
    try {
      await fn(req, res)
    } catch (error) {
      next(error)
    }
  }
}

router.get('/my', inlineAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  await controller.getUserGiftsAsync(req, res)
}))

router.get('/', asyncHandler((req, res) => 
  controller.getGiftsAsync(req, res)
))

router.get('/:id/history', asyncHandler((req, res) => 
  controller.getGiftHistoryAsync(req, res)
))

router.get('/:id', inlineAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  await controller.getByIdAsync(req, res)
}))

export { router as giftRoutes }
