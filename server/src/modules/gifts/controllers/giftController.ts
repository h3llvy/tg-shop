import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Gift } from '../../database/models/Gift'
import { LoggerService } from '../../core/services/loggerService'

export class GiftController {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async getGiftsAsync(req: Request, res: Response) {
    try {
      const gifts = await Gift.find({ isAvailable: true })
      res.json(gifts)
    } catch (error) {
      this.p_logger.logError('Ошибка получения подарков:', error)
      res.status(500).json({ error: 'Ошибка получения подарков' })
    }
  }

  public async getGiftByIdAsync(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      if (!id) {
        this.p_logger.logWarning('ID подарка не указан')
        return res.status(400).json({ error: 'ID подарка не указан' })
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        this.p_logger.logWarning('Неверный формат ID подарка:', id)
        return res.status(400).json({ error: 'Неверный формат ID подарка' })
      }

      const gift = await Gift.findById(id)
      if (!gift) {
        this.p_logger.logWarning('Подарок не найден:', id)
        return res.status(404).json({ error: 'Подарок не найден' })
      }

      res.json(gift)
    } catch (error) {
      this.p_logger.logError('Ошибка получения подарка:', error)
      res.status(500).json({ error: 'Ошибка получения подарка' })
    }
  }
}
