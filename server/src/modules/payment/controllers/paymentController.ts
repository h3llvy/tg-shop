import { Request, Response } from 'express'
import { LoggerService } from '../../core/services/loggerService'
import { TelegramService } from '../../telegram/services/telegramService'
import { GiftService } from '../../gifts/services/giftService'
import { cryptoPayService } from '../services/cryptoPayService'

export class PaymentController {
  private readonly p_logger: LoggerService
  private readonly p_telegramService: TelegramService
  private readonly p_giftService: GiftService

  constructor() {
    this.p_logger = new LoggerService()
    this.p_telegramService = new TelegramService()
    this.p_giftService = new GiftService()
  }

  public async createPaymentAsync(req: Request, res: Response) {
    try {
      const { amount, giftId, giftName, asset } = req.body
      
      // Проверяем доступность подарка
      const gift = await this.p_giftService.getByIdAsync(giftId)
      if (!gift || !gift.isAvailable || gift.availableQuantity <= 0) {
        return res.status(400).json({ error: 'Подарок недоступен для покупки' })
      }

      // Проверяем корректность суммы для выбранной валюты
      if (gift.prices[asset] !== amount) {
        return res.status(400).json({ error: 'Некорректная сумма для выбранной валюты' })
      }

      // Создаем инвойс через Crypto Pay
      const invoice = await cryptoPayService.createInvoiceAsync(
        amount,
        JSON.stringify({ giftId }),
        giftName,
        asset
      )

      this.p_logger.logInfo('Инвойс создан:', invoice)
      res.json(invoice)
    } catch (error) {
      this.p_logger.logError('Ошибка создания платежа:', error)
      res.status(500).json({ error: 'Ошибка создания платежа' })
    }
  }

  public async handleWebhookAsync(req: Request, res: Response) {
    try {
      const { invoice_id, status, payload, user_id } = req.body
      
      if (status === 'paid') {
        const { giftId } = JSON.parse(payload)
        
        // Обновляем статус подарка
        const gift = await this.p_giftService.purchaseAsync(giftId, user_id.toString())
        
        // Отправляем уведомление через бота
        if (user_id) {
          await this.p_telegramService.notifyPaymentSuccessAsync(user_id, gift.name)
        }
        
        res.json({ success: true })
      } else {
        res.json({ status: 'pending' })
      }
    } catch (error) {
      this.p_logger.logError('Ошибка обработки вебхука:', error)
      res.status(500).json({ error: 'Ошибка обработки вебхука' })
    }
  }
} 