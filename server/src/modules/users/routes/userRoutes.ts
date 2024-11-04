import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new UserController()

// Публичные маршруты
router.post('/', (req, res) => controller.createUserAsync(req, res))
router.get('/avatar/:userId', (req, res) => controller.getUserAvatarAsync(req, res))

// Защищенные маршруты (если нужны)
router.get('/me', authMiddleware, (req, res) => {
  // ... получение данных текущего пользователя
})

export { router as userRoutes }
