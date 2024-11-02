import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new UserController()

router.get('/me/avatar', (req, res) => {
  controller.getUserAvatarAsync(req, res)
})

export { router as userRoutes }
