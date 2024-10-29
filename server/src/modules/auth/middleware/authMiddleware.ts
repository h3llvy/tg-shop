import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { IAuthUser } from '../types/auth'

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ error: 'Отсутствует токен авторизации' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number }
    req.user = { id: decoded.userId } as IAuthUser
    next()
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен авторизации' })
  }
}
