import type { HandlerBot } from '../../../types/bot'
import type { Context } from 'grammy'
import { config } from '../../../config'

export const setupStartCommand = (bot: HandlerBot): void => {
  bot.command('start', async (ctx: Context) => {
    try {
      const keyboard = {
        inline_keyboard: [[
          {
            text: 'Открыть магазин подарков',
            web_app: { url: config.WEBAPP_URL }
          }
        ]]
      }

      await ctx.reply(
        'Добро пожаловать в магазин подарков! 🎁\n\n' +
        'Здесь вы можете покупать и отправлять подарки другим пользователям Telegram.',
        { reply_markup: keyboard }
      )
    } catch (error) {
      console.error('Ошибка в команде start:', error)
      await ctx.reply('Произошла ошибка при запуске бота. Пожалуйста, попробуйте позже.')
    }
  })
}
