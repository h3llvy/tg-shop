import type { HandlerBot, BotContext } from '../../../types/bot'
import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'

export const setupStartCommand = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.command('start', async (ctx: BotContext) => {
    try {
      if (!ctx.from) {
        await ctx.reply('Ошибка: не удалось получить данные пользователя')
        return
      }

      // Создаем пользователя через API сервера
      await apiService.post('/api/users', {
        telegramId: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name || undefined,
        username: ctx.from.username || undefined,
        languageCode: ctx.from.language_code || undefined
      })

      // Устанавливаем начальное состояние сессии
      ctx.session = {
        step: 'idle',
        giftData: null
      }

      logger.logInfo('Пользователь создан/обновлен:', { telegramId: ctx.from.id })
      
      const keyboard = {
        inline_keyboard: [[
          {
            text: 'Открыть магазин подарков',
            web_app: { url: process.env.WEBAPP_URL || '' }
          }
        ]]
      }

      await ctx.reply(
        'Добро пожаловать в магазин подарков! 🎁\n\n' +
        'Здесь вы можете покупать и отправлять подарки другим пользователям Telegram.',
        { reply_markup: keyboard }
      )
    } catch (error) {
      logger.logError('Ошибка в команде start:', error)
      await ctx.reply('Произошла ошибка при запуске бота. Пожалуйста, попробуйте позже.')
    }
  })
}
