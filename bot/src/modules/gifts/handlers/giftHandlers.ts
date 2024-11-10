import type { HandlerBot } from '../../../types/bot'
import type { Context } from 'grammy'
import { GiftService } from '../services/giftService'
import { NotificationService } from '../../notifications/services/notificationService'
import { LoggerService } from '../../core/services/loggerService'
import { UserService } from '../../users/services/userService'

export function setupGiftHandlers(bot: HandlerBot): void {
  const giftService = new GiftService()
  const notificationService = new NotificationService()
  const logger = new LoggerService()
  const userService = new UserService()

  bot.command('sendgift', async (ctx: Context) => {
    try {
      const userId = ctx.from?.id
      if (!userId) {
        await ctx.reply('Необходимо авторизоваться для отправки подарков')
        return
      }

      await ctx.reply('Выберите подарок для отправки 🎁')
    } catch (error) {
      logger.logError(error as Error, 'giftHandlers.sendgift')
      await ctx.reply('Произошла ошибка при отправке подарка')
    }
  })

  bot.on('callback_query:data', async (ctx) => {
    try {
      const data = ctx.callbackQuery.data
      if (!data.startsWith('gift:')) return

      const [action, giftId] = data.split(':')
      const userId = ctx.from.id

      if (action === 'send') {
        const targetUserId = ctx.callbackQuery.message?.reply_to_message?.from?.id
        if (!targetUserId) {
          await ctx.answerCallbackQuery('Не удалось определить получателя')
          return
        }

        await giftService.sendGiftAsync(
          giftId,
          userId.toString(),
          targetUserId.toString()
        )

        await userService.incrementGiftsSentAsync(userId)
        await userService.incrementGiftsReceivedAsync(targetUserId)

        await notificationService.notifyGiftSentAsync(userId, ctx.from.first_name)
        await ctx.answerCallbackQuery('Подарок успешно отправлен!')
      }
    } catch (error) {
      logger.logError(error as Error, 'giftHandlers.callback')
      await ctx.answerCallbackQuery('Произошла ошибка при обработке действия')
    }
    
  })
}
