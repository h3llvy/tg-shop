import { Context } from 'grammy'
import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'

export class PaymentHandler {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async handlePaymentAsync(ctx: Context): Promise<void> {
    try {
      const paymentId = ctx.message?.successful_payment?.provider_payment_charge_id
      
      if (!paymentId) {
        await ctx.reply('Не удалось получить ID платежа')
        return
      }

      // Исправлено: verifyPayment -> verifyPaymentAsync
      const isVerified = await apiService.verifyPaymentAsync(paymentId)
      
      if (isVerified) {
        await ctx.reply('Платеж успешно подтвержден!')
      } else {
        await ctx.reply('Не удалось подтвердить платеж')
      }
    } catch (error) {
      this.p_logger.logError(error as Error, 'PaymentHandler.handlePaymentAsync')
      await ctx.reply('Произошла ошибка при обработке платежа')
    }
  }
}
