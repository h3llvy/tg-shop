import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new UserController()

// Публичные маршруты
router.post('/', (req, res) => controller.createUserAsync(req, res))

// Защищенные маршруты
router.get('/me/avatar', (req, res) => {
  controller.getUserAvatarAsync(req, res)
})

export { router as userRoutes }
