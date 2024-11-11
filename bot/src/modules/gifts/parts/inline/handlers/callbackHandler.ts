import { HandlerBot } from '../../../../../types/bot'
import { giftService } from '../../../services/giftService'

export const setupGiftCallbackHandlers = (bot: HandlerBot): void => {
  bot.callbackQuery(/^receive_gift:(.+)$/, async (ctx) => {
    try {
      const giftId = ctx.match[1]
      const userId = ctx.from.id
      
      // Проверяем подарок
      const gift = await giftService.getGiftByIdAsync(giftId)
      if (!gift) {
        await ctx.answerCallbackQuery({
          text: 'Gift not found',
          show_alert: true
        })
        return
      }

      // Открываем Web App для получения подарка
      await ctx.answerCallbackQuery({
        url: `${process.env.WEBAPP_URL}/gifts/${giftId}/receive`
      })
      
    } catch (error) {
      console.error('Error in callback handler:', error)
      await ctx.answerCallbackQuery({
        text: 'An error occurred',
        show_alert: true
      })
    }
  })
}
