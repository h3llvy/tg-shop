import { Router, Request, Response, NextFunction } from 'express'
import { LeaderboardController } from '../controllers/leaderboardController'
import { telegramAuthMiddleware } from '../../auth/middleware/telegramAuthMiddleware'

const router = Router()
const controller = new LeaderboardController()

router.get('/', telegramAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller.getLeaderboardAsync(req, res)
  } catch (error) {
    next(error)
  }
})

export { router as leaderboardRoutes } 