import { HandlerBot } from '../../../types/bot'
import { LoggerService } from '../../core/services/loggerService'
import { InlineKeyboard } from 'grammy'
import path from 'path'
import fs from 'fs'
import { InputFile } from 'grammy'
import { UserService } from '../../core/services/userService'

const logger = new LoggerService()
const userService = new UserService()

export function setupStartCommand(bot: HandlerBot): void {
  bot.command('start', async (ctx) => {
    try {
      if (!ctx.from) {
        logger.logWarning('No user data in context')
        return
      }

      const userId = ctx.from.id
      const firstName = ctx.from.first_name
      const lastName = ctx.from.last_name || ''
      const username = ctx.from.username || ''
      const languageCode = ctx.from.language_code || 'en'

      await userService.createOrUpdateUserAsync({
        telegramId: userId,
        firstName,
        lastName,
        username,
        languageCode
      })

      logger.logInfo('User created/updated:', { telegramId: userId })

      const startImagePath = path.resolve(__dirname, '../../../../assets/botstart.png')
      
      logger.logInfo('Trying to send photo:', {
        path: startImagePath,
        exists: fs.existsSync(startImagePath)
      })

      const photo = new InputFile(startImagePath)
      
      const keyboard = new InlineKeyboard()
        .webApp('🎁 Open Gift Shop', process.env.WEBAPP_URL || '')

      await ctx.replyWithPhoto(photo, {
        caption: '🎁 Welcome to Gift Shop!\n\nHere you can buy and send crypto gifts to your friends.',
        reply_markup: keyboard
      })
    } catch (error) {
      logger.logError('Error in start command:', error)
      
      const keyboard = new InlineKeyboard()
        .webApp('🎁 Open Gift Shop', process.env.WEBAPP_URL || '')

      await ctx.reply('🎁 Welcome to Gift Shop!\n\nHere you can buy and send crypto gifts to your friends.', {
        reply_markup: keyboard
      })
    }
  })
}
