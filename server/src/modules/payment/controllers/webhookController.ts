import { Request, Response } from 'express'
import CryptoBotAPI from 'crypto-bot-api'
import { config } from '../../../config'
import { LoggerService } from '../../core/services/loggerService'
import { PaymentService } from '../services/paymentService'
import type { IPaymentWebhook } from '../types/payment'
import { TelegramService } from '../../telegram/services/telegramService'
import { GiftService } from '../../gifts/services/giftService'
import { WebSocketService } from '../../websocket/services/websocketService'

export class WebhookController {
  private readonly p_logger: LoggerService
  private readonly p_paymentService: PaymentService
  private readonly p_cryptoBot: CryptoBotAPI
  private readonly p_telegramService: TelegramService
  private readonly p_giftService: GiftService
  private readonly p_webSocketService: WebSocketService
  private processedInvoices = new Set<number>()

  constructor() {
    this.p_logger = new LoggerService()
    this.p_paymentService = new PaymentService()
    this.p_cryptoBot = new CryptoBotAPI(config.CRYPTO_PAY_API_TOKEN)
    this.p_telegramService = new TelegramService()
    this.p_giftService = new GiftService()
    this.p_webSocketService = WebSocketService.getInstance()
  }

  public async handleWebhookAsync(req: Request, res: Response): Promise<void> {
    try {
      const { invoice_id } = req.body.payload

      // Проверяем, не обработан ли уже этот инвойс
      if (this.processedInvoices.has(invoice_id)) {
        this.p_logger.logInfo('Инвойс уже обработан:', { invoice_id })
        res.status(200).json({ status: 'already_processed' })
        return
      }

      // Логируем входящий вебхук
      this.p_logger.logInfo('Получен вебхук от Crypto Pay:', {
        body: req.body,
        headers: {
          signature: req.headers['crypto-pay-api-signature']
        }
      })

      const signature = req.headers['crypto-pay-api-signature']
      if (!signature || typeof signature !== 'string') {
        this.p_logger.logWarning('Отсутствует подпись вебхука')
        res.status(400).json({ error: 'Отсутствует подпись' })
        return
      }

      // Получаем данные из вебхука
      const webhook = req.body
      const { payload } = webhook

      if (payload.status === 'paid') {
        try {
          // Парсим payload из инвойса
          const invoicePayload = JSON.parse(payload.payload || '{}')
          const { giftId, userId } = invoicePayload

          if (!giftId) {
            throw new Error('GiftId не найден в payload')
          }

          // Обрабатываем платеж
          await this.p_paymentService.handlePaymentWebhookAsync({
            id: payload.invoice_id,
            status: payload.status,
            hash: payload.hash,
            asset: payload.asset,
            amount: payload.paid_amount,
            fee: payload.fee,
            fee_asset: payload.fee_asset,
            paid_anonymously: payload.paid_anonymously,
            payload: payload.payload,
            paid_at: payload.paid_at,
            created_at: payload.created_at
          })

          // Получаем информацию о подарке
          const gift = await this.p_giftService.getByIdAsync(giftId)
          
          // Отправляем уведомление через бот
          if (userId && gift) {
            await this.p_telegramService.sendMessage(userId, {
              text: `✅ You have purchased the gift of ${gift.name}`,
              reply_markup: {
                inline_keyboard: [[
                  {
                    text: "Open Gift",
                    web_app: {
                      url: `${config.WEBAPP_URL}/gifts/${gift._id}/purchased?paymentAmount=${payload.paid_amount}&paymentAsset=${payload.asset}`
                    }
                  }
                ]]
              }
            })
      
            
            // Отправляем уведомление через WebSocket
            this.p_webSocketService.sendPaymentSuccess(userId, {
              giftId: gift._id,
              paymentAmount: payload.paid_amount,
              paymentAsset: payload.asset
            })
          }

          this.p_logger.logInfo('Платеж успешно обработан', {
            invoiceId: payload.invoice_id,
            giftId
          })
        } catch (error) {
          this.p_logger.logError('Ошибка обработки платежа:', error)
          throw error
        }
      }

      // Добавляем инвойс в обработанные
      this.processedInvoices.add(invoice_id)
      
      res.status(200).json({ status: 'success' })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Неизвестная ошибка')
      this.p_logger.logError('Ошибка обработки вебхука:', {
        error: err.message,
        stack: err.stack
      })
      res.status(500).json({ error: 'Внутренняя ошибка сервера' })
    }
  }
} 