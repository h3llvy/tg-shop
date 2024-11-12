import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'
import { User } from '../../database/models'

const router = Router()
const controller = new UserController()

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован' })
    }

    const user = await User.findOne({ telegramId: req.user.id })
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    res.json({
      id: user.telegramId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      isPremium: user.isPremium,
      giftsReceived: user.giftsReceived,
      giftsSent: user.giftsSent,
      avatar: user.avatar?.url
    })
  } catch (error) {
    console.error('Ошибка получения профиля:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// Остальные маршруты
router.post('/', (req, res) => controller.createUserAsync(req, res))
router.get('/avatar/:userId', (req, res) => controller.getUserAvatarAsync(req, res))

export { router as userRoutes }
