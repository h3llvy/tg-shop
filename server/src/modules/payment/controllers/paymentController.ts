import { Request, Response } from 'express'
import { CryptoPayService } from '../services/cryptoPayService'

export class PaymentController {
  private readonly p_cryptoPayService: CryptoPayService

  constructor() {
    this.p_cryptoPayService = new CryptoPayService()
  }

  public async createPaymentAsync(req: Request, res: Response): Promise<void> {
    try {
      const { amount, description } = req.body

      if (!amount || !description) {
        res.status(400).json({ error: 'Не указана сумма или описание' })
        return
      }

      const invoice = await this.p_cryptoPayService.createInvoiceAsync(amount, description)
      res.json(invoice)
    } catch (error) {
      console.error('Ошибка создания платежа:', error)
      res.status(500).json({ error: 'Не удалось создать платеж' })
    }
  }

  public async checkPaymentAsync(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params

      if (!invoiceId) {
        res.status(400).json({ error: 'Не указан ID инвойса' })
        return
      }

      const isPaid = await this.p_cryptoPayService.checkPaymentAsync(Number(invoiceId))
      res.json({ paid: isPaid })
    } catch (error) {
      console.error('Ошибка проверки платежа:', error)
      res.status(500).json({ error: 'Не удалось проверить платеж' })
    }
  }

  public async handleWebhookAsync(req: Request, res: Response): Promise<void> {
    try {
      await this.p_cryptoPayService.handleWebhookAsync(req.body)
      res.sendStatus(200)
    } catch (error) {
      console.error('Ошибка обработки вебхука:', error)
      res.status(500).json({ error: 'Не удалось обработать вебхук' })
    }
  }
} 