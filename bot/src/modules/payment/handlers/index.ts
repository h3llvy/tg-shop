import { HandlerBot } from '../../../types/bot'
import { Context } from 'grammy'

export function setupPaymentHandlers(bot: HandlerBot) {
  // Обработка успешных платежей
  bot.on(':successful_payment', async (ctx: Context) => {
    console.log('Успешный платеж:', ctx.message?.successful_payment)
    await ctx.reply('Спасибо за оплату! 🎉')
  })

  // Обработка предварительных платежей
  bot.command('pay', async (ctx: Context) => {
    await ctx.reply('Функция оплаты находится в разработке! 💳')
  })
}
