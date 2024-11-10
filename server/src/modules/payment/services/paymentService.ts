import { LoggerService } from '../../core/services/loggerService'
import { GiftService } from '../../gifts/services/giftService'
import type { IPaymentWebhook, CryptoAsset } from '../types/payment'

export class PaymentService {
  private readonly p_logger: LoggerService
  private readonly p_giftService: GiftService

  constructor() {
    this.p_logger = new LoggerService()
    this.p_giftService = new GiftService()
  }

  public async handlePaymentWebhookAsync(_webhook: IPaymentWebhook): Promise<void> {
    try {
      this.p_logger.logInfo('Обработка платежа:', {
        id: _webhook.id,
        status: _webhook.status,
        asset: _webhook.asset,
        amount: _webhook.amount
      })

      if (_webhook.status === 'paid') {
        let payload: { giftId: string; userId?: number }
        try {
          payload = JSON.parse(_webhook.payload || '{}')
        } catch (e) {
          throw new Error('Невалидный payload: ' + _webhook.payload)
        }

        if (!payload.giftId) {
          throw new Error('GiftId не найден в payload')
        }

        // Получаем подарок
        const gift = await this.p_giftService.getByIdAsync(payload.giftId)
        if (!gift) {
          throw new Error(`Подарок не найден: ${payload.giftId}`)
        }

        // Проверяем сумму платежа
        const expectedAmount = gift.prices[_webhook.asset as CryptoAsset]
        if (Number(_webhook.amount) !== expectedAmount) {
          throw new Error(`Неверная сумма платежа: получено ${_webhook.amount}, ожидалось ${expectedAmount}`)
        }

        try {
          // Уменьшаем количество доступных подарков
          await this.p_giftService.decrementAvailableQuantityAsync(
            payload.giftId,
            payload.userId
          )

          this.p_logger.logInfo('Платеж успешно обработан', {
            giftId: payload.giftId,
            invoiceId: _webhook.id,
            amount: _webhook.amount,
            asset: _webhook.asset,
            userId: payload.userId
          })
        } catch (error) {
          if (error instanceof Error && error.message === 'Подарок закончился') {
            this.p_logger.logWarning('Попытка купить закончившийся подарок', {
              giftId: payload.giftId,
              invoiceId: _webhook.id
            })
          }
          throw error
        }
      }
    } catch (error) {
      this.p_logger.logError('Ошибка обработки платежа:', error)
      throw error
    }
  }

  public async verifyPaymentAmountAsync(
    _amount: number, 
    _asset: CryptoAsset,
    _giftId: string
  ): Promise<boolean> {
    try {
      const gift = await this.p_giftService.getByIdAsync(_giftId)
      if (!gift) {
        throw new Error('Подарок не найден')
      }

      return _amount === gift.prices[_asset]
    } catch (error) {
      this.p_logger.logError('Ошибка проверки суммы платежа:', error)
      throw error
    }
  }
} 