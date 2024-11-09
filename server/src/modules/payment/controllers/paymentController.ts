import { Request, Response } from 'express'
import { cryptoPayService } from '../services/cryptoPayService'
import { LoggerService } from '../../core/services/loggerService'

export class PaymentController {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async createPaymentAsync(req: Request, res: Response) {
    try {
      const { amount, payload } = req.body
      
      this.p_logger.logInfo('Создание платежа:', { amount, payload })

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Неверная сумма' })
      }

      // Создаем инвойс через Crypto Pay API
      const invoice = await cryptoPayService.createInvoiceAsync(amount, payload)
      
      res.json({
        invoice_id: invoice.invoice_id,
        status: invoice.status,
        pay_url: invoice.pay_url
      })
    } catch (error) {
      this.p_logger.logError('Ошибка создания платежа:', error)
      res.status(500).json({ 
        error: 'Ошибка создания платежа',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  public async checkPaymentAsync(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params
      const invoice = await cryptoPayService.getInvoiceAsync(Number(invoiceId))
      res.json(invoice)
    } catch (error) {
      this.p_logger.logError('Ошибка проверки платежа:', error)
      res.status(500).json({ error: 'Ошибка проверки платежа' })
    }
  }

  public async handleWebhookAsync(req: Request, res: Response) {
    try {
      const { invoice_id, status, payload } = req.body
      
      // Здесь будет логика обработки вебхука от Crypto Pay
      this.p_logger.logInfo('Получен вебхук:', { invoice_id, status, payload })
      
      res.json({ success: true })
    } catch (error) {
      this.p_logger.logError('Ошибка обработки вебхука:', error)
      res.status(500).json({ error: 'Ошибка обработки вебхука' })
    }
  }
} 