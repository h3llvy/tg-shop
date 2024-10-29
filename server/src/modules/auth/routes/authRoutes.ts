import { Router } from 'express'
import { AuthController } from '../controllers/authController'

const router = Router()
const controller = new AuthController()

router.post('/login', (req, res) => {
  controller.loginAsync(req, res)
})

export { router as authRoutes }
