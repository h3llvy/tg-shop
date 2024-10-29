import { Bot } from 'grammy'
import { notifyPaymentSuccess } from '../services/notificationService'
import { apiService } from '../../core/services/apiService'

export function setupPaymentHandlers(bot: Bot) {
  bot.on(':successful_payment', async (ctx) => {  // Обратите внимание на двоеточие
    try {
      if (!ctx.message?.successful_payment) return

      const payment = ctx.message.successful_payment
      
      // Верифицируем платеж через наш сервер
      await apiService.verifyPayment(payment.telegram_payment_charge_id)
      
      // Отправляем уведомление пользователю
      await notifyPaymentSuccess(ctx, payment)
    } catch (error) {
      console.error('Ошибка при обработке платежа:', error)
      await ctx.reply('Произошла ошибка при обработке платежа. Пожалуйста, обратитесь в поддержку.')
    }
  })
}
