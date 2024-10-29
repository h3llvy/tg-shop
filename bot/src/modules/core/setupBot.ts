import { Bot, session } from 'grammy'
import { setupCommandHandlers } from '../commands/handlers'
import { setupGiftHandlers } from '../gifts/handlers/giftHandlers'
import { setupPaymentHandlers } from '../payment/handlers'
import { setupWebAppHandlers } from '../webapp/handlers/webAppHandlers'
import { setupInlineHandlers } from '../inline/handlers/inlineHandler'
import { LoggerService } from './services/loggerService'
import type { BotContext, SessionData, HandlerBot } from '../../types/bot'

export const setupBot = (bot: Bot<BotContext>): HandlerBot => {
  const logger = new LoggerService()

  bot.use(
    session({
      initial: (): SessionData => ({
        step: 'idle',
        giftData: null
      })
    })
  )

  setupCommandHandlers(bot as HandlerBot)
  setupGiftHandlers(bot as HandlerBot)
  setupPaymentHandlers(bot as HandlerBot)
  setupWebAppHandlers(bot as HandlerBot)
  setupInlineHandlers(bot as HandlerBot)

  bot.hears(/^\/[a-zA-Z0-9_]+$/, async (ctx) => {
    const commandText = ctx.message?.text
    const userId = ctx.from?.id
    const username = ctx.from?.username

    logger.logWarning('Получена неизвестная команда:', {
      command: commandText,
      userId,
      username
    })

    await ctx.reply('Неизвестная команда. Используйте /help для списка доступных команд.')
  })

  return bot as HandlerBot
}
