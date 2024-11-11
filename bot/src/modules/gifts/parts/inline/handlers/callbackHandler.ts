import { HandlerBot } from '../../../../../types/bot'
import { giftService } from '../../../services/giftService'
import { LoggerService } from '../../../../core/services/loggerService'

export const setupGiftCallbackHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.callbackQuery(/^receive_gift:(.+)$/, async (ctx) => {
    try {
      const giftId = ctx.match[1]
      const userId = ctx.from.id
      
      // Получаем подарок
      const userGift = await giftService.getUserGiftAsync(giftId)
      if (!userGift) {
        await ctx.answerCallbackQuery({
          text: 'Gift not found',
          show_alert: true
        })
        return
      }

      // Проверяем владельца подарка
      if (userGift.userId !== userId) {
        await ctx.answerCallbackQuery({
          text: 'You can only send your own gifts',
          show_alert: true
        })
        return
      }

      // Проверяем статус подарка
      if (userGift.status !== 'purchased') {
        await ctx.answerCallbackQuery({
          text: 'This gift has already been sent or received',
          show_alert: true
        })
        return
      }

      // Передаем подарок получателю
      await giftService.receiveGiftAsync(giftId, userId)

      // Открываем Web App для получения подарка
      await ctx.answerCallbackQuery({
        url: `${process.env.WEBAPP_URL}/gifts/received`
      })
      
    } catch (error) {
      logger.logError('Error in callback handler:', error)
      await ctx.answerCallbackQuery({
        text: 'An error occurred',
        show_alert: true
      })
    }
  })
}
