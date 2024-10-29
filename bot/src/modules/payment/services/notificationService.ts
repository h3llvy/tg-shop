import { Context } from 'grammy'

export async function notifyPaymentSuccess(ctx: Context, payment: any) {
  const message = `
🎉 Оплата успешно завершена!

Сумма: ${payment.total_amount / 100} ${payment.currency}
ID платежа: ${payment.telegram_payment_charge_id}

Спасибо за покупку! Ваш подарок готов к отправке.
`
  await ctx.reply(message)
}
