import { HandlerBot } from '../../../../../types/bot'
import { giftService } from '../../../services/giftService'

export const setupGiftCallbackHandlers = (bot: HandlerBot): void => {
  bot.callbackQuery(/^view_gift:(.+)$/, async (ctx) => {
    try {
      const giftId = ctx.match[1]
      const gift = await giftService.getGiftByIdAsync(giftId)
      
      if (!gift) {
        await ctx.answerCallbackQuery({
          text: 'Gift not found',
          show_alert: true
        })
        return
      }

      await ctx.answerCallbackQuery()
      
      // Отправляем сообщение с кнопкой открытия магазина
      await ctx.reply(`🎁 ${gift.name}\n\nView this gift in our store!`, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🎁 Open Gift Shop',
              web_app: { url: `${process.env.WEBAPP_URL}/gifts/${gift.id}` }
            }
          ]]
        }
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
