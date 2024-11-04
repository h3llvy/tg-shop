import { Router, Request, Response } from 'express'
import { UserService } from '../services/userService'

const router = Router()
const userService = new UserService()

router.get('/avatar/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId)
    const avatarUrl = await userService.getUserAvatarUrlAsync(userId)
    res.json({ url: avatarUrl })
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить аватар' })
  }
})

export { router as userRoutes } 