import { InputFile } from 'grammy'
import type { HandlerBot, BotContext } from '../../../types/bot'
import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'
import { BOT_ASSETS } from '../../core/config/assets'

export const setupStartCommand = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.command('start', async (ctx: BotContext) => {
    try {
      if (!ctx.from) {
        await ctx.reply('Error: Could not get user data')
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

      logger.logInfo('User created/updated:', { telegramId: ctx.from.id })
      
      const keyboard = {
        inline_keyboard: [[
          {
            text: 'Open App',
            web_app: { url: process.env.WEBAPP_URL || '' }
          }
        ]]
      }

      try {
        logger.logInfo('Trying to send photo from:', BOT_ASSETS.START_IMAGE)
        await ctx.replyWithPhoto(new InputFile(BOT_ASSETS.START_IMAGE), {
          caption: '🎁 Here you can buy and send gifts to your friends.',
          reply_markup: keyboard
        })
      } catch (photoError) {
        logger.logError('Error sending photo:', {
          error: photoError,
          path: BOT_ASSETS.START_IMAGE,
          exists: require('fs').existsSync(BOT_ASSETS.START_IMAGE)
        })
        // Отправляем только текст если картинка недоступна
        await ctx.reply('🎁 Here you can buy and send gifts to your friends.', {
          reply_markup: keyboard
        })
      }

    } catch (error) {
      logger.logError('Error in start command:', error)
      await ctx.reply('An error occurred while starting the bot. Please try again later.')
    }
  })
}
