import { Request, Response } from 'express'
import { GiftService } from '../services/giftService'

export class GiftController {
  private readonly p_giftService: GiftService

  constructor() {
    this.p_giftService = new GiftService()
  }

  public async getGiftsAsync(_req: Request, res: Response): Promise<void> {
    try {
      const gifts = await this.p_giftService.getAllAsync()
      res.json(gifts)
    } catch (error) {
      console.error('Ошибка при получении подарков:', error)
      res.status(500).json({ error: 'Не удалось получить подарки' })
    }
  }

  public async getGiftByIdAsync(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const gift = await this.p_giftService.getByIdAsync(id)
      
      if (!gift) {
        res.status(404).json({ error: 'Подарок не найден' })
        return
      }
      
      res.json(gift)
    } catch (error) {
      console.error('Ошибка при получении подарка:', error)
      res.status(500).json({ error: 'Не удалось получить подарок' })
    }
  }

  public async purchaseGiftAsync(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.id.toString()
      
      if (!userId) {
        res.status(401).json({ error: 'Пользователь не авторизован' })
        return
      }
      
      const result = await this.p_giftService.purchaseAsync(id, userId)
      res.json(result)
    } catch (error) {
      console.error('Ошибка при покупке подарка:', error)
      res.status(500).json({ error: 'Не удалось купить подарок' })
    }
  }

  public async sendGiftAsync(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { recipientId } = req.body
      const userId = req.user?.id.toString()

      if (!userId) {
        res.status(401).json({ error: 'Пользователь не авторизован' })
        return
      }

      if (!recipientId) {
        res.status(400).json({ error: 'Не указан получатель' })
        return
      }
      
      const result = await this.p_giftService.sendAsync(id, userId, recipientId)
      res.json(result)
    } catch (error) {
      console.error('Ошибка при отправке подарка:', error)
      res.status(500).json({ error: 'Не удалось отправить подарок' })
    }
  }
}
