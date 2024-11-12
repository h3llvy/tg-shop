import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'
import { User } from '../../database/models'
import { UserService } from '../services/userService'

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

router.get('/profile/full', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован' })
    }

    const userService = new UserService()
    const profileData = await userService.getUserProfileWithGiftsAsync(req.user.id)
    
    res.json(profileData)
  } catch (error) {
    console.error('Ошибка получения полного профиля:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

router.get('/gifts/history', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован' })
    }

    const userService = new UserService()
    const gifts = await userService.getUserGiftsHistoryAsync(req.user.id)
    
    res.json(gifts)
  } catch (error) {
    console.error('Ошибка получения истории подарков:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// Добавляем маршрут для получения профиля по ID
router.get('/profile/full/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Неверный ID пользователя' })
    }

    const userService = new UserService()
    const profileData = await userService.getUserProfileWithGiftsAsync(userId)
    
    res.json(profileData)
  } catch (error) {
    console.error('Ошибка получения профиля пользователя:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// Остальные маршруты
router.post('/', (req, res) => controller.createUserAsync(req, res))
router.get('/avatar/:userId', (req, res) => controller.getUserAvatarAsync(req, res))

router.get('/mypurchasedgifts', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован' })
    }

    const userService = new UserService()
    const gifts = await userService.getPurchasedGiftsAsync(req.user.id)
    
    res.json(gifts)
  } catch (error) {
    console.error('Ошибка получения купленных подарков:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

export { router as userRoutes }
