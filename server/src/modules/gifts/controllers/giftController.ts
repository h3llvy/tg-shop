import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Gift } from '../../database/models/Gift'
import { LoggerService } from '../../core/services/loggerService'
import { GiftService } from '../services/giftService'
import { GiftHistoryService } from '../services/giftHistoryService'

const logger = new LoggerService()

export class GiftController {
  private readonly p_logger: LoggerService
  private readonly p_giftService: GiftService
  private readonly p_giftHistoryService: GiftHistoryService

  constructor() {
    this.p_logger = new LoggerService()
    this.p_giftService = new GiftService()
    this.p_giftHistoryService = new GiftHistoryService()
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

  public async getByIdAsync(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      
      this.p_logger.logInfo('Получен запрос на подарок:', { 
        id,
        userAgent: req.headers['user-agent'],
        isInline: id.startsWith('gift_')
      })
      
      if (!id) {
        this.p_logger.logWarning('ID подарка не предоставлен')
        res.status(400).json({ error: 'ID подарка не предоставлен' })
        return
      }
      
      // Обрабатываем inline ID
      const realGiftId = id.startsWith('gift_') ? id.replace('gift_', '') : id
      
      // Проверяем валидность ID для MongoDB
      if (!mongoose.Types.ObjectId.isValid(realGiftId)) {
        this.p_logger.logWarning('Неверный формат ID подарка:', { id: realGiftId })
        res.status(400).json({ error: 'Неверный формат ID подарка' })
        return
      }
      
      const gift = await Gift.findById(realGiftId)
      
      if (!gift) {
        this.p_logger.logWarning('Подарок не найден:', { id: realGiftId })
        res.status(404).json({ error: 'Подарок не найден' })
        return
      }

      this.p_logger.logInfo('Подарок получен успешно:', { id: realGiftId })
      res.json(gift)
    } catch (error) {
      this.p_logger.logError('Ошибка получения подарка:', error)
      res.status(500).json({ error: 'Ошибка получения подарка' })
    }
  }

  public async getUserGiftsAsync(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        this.p_logger.logWarning('Попытка получить подарки без авторизации')
        res.status(401).json({ error: 'Пользователь не авторизован' })
        return
      }

      const gifts = await this.p_giftService.getUserGiftsAsync(userId)
      
      this.p_logger.logInfo('Получены подарки пользователя', { 
        userId,
        count: gifts.length 
      })
      
      res.json(gifts)
    } catch (error) {
      this.p_logger.logError('Ошибка получения подарков пользователя:', error)
      res.status(500).json({ error: 'Ошибка получения подарков' })
    }
  }

  public async getGiftHistoryAsync(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        this.p_logger.logWarning('Неверный формат ID подарка:', id)
        res.status(400).json({ error: 'Неверный формат ID подарка' })
        return
      }

      const history = await this.p_giftHistoryService.getGiftHistoryAsync(id)
      
      this.p_logger.logInfo('Получена история подарка', { 
        giftId: id,
        count: history.length 
      })
      
      res.json(history)
    } catch (error) {
      this.p_logger.logError('Ошибка получения истории подарка:', error)
      res.status(500).json({ error: 'Ошибка получения истории подарка' })
    }
  }
}
