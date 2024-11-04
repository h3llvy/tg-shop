import { Bot, session } from 'grammy'
import type { BotContext, SessionData } from '../../types/bot'
import { setupCommandHandlers } from '../commands/handlers'
import { setupGiftHandlers } from '../gifts/handlers/giftHandlers'
import { setupPaymentHandlers } from '../payment/handlers'
import { setupWebAppHandlers } from '../webapp/handlers/webAppHandlers'
import { setupInlineHandlers } from '../inline/handlers/inlineHandler'
import { LoggerService } from './services/loggerService'

export const setupBot = (bot: Bot<BotContext>): Bot<BotContext> => {
  const logger = new LoggerService()

  bot.use(
    session({
      initial: (): SessionData => ({
        step: 'idle',
        giftData: null
      })
    })
  )

  setupCommandHandlers(bot)
  setupGiftHandlers(bot)
  setupPaymentHandlers(bot)
  setupWebAppHandlers(bot)
  setupInlineHandlers(bot)

  bot.catch((err) => {
    logger.logError('Ошибка бота:', err)
  })

  return bot
}
