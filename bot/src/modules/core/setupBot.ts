import { Bot, session, GrammyError, HttpError } from 'grammy'
import type { BotContext, SessionData } from '../../types/bot'
import { setupCommandHandlers } from '../commands/handlers'
import { setupGiftHandlers } from '../gifts/handlers/giftHandlers'
import { setupPaymentHandlers } from '../payment/handlers'
import { setupWebAppHandlers } from '../webapp/handlers/webAppHandlers'
import { setupInlineGiftHandlers } from '../gifts/parts/inline/handlers/inlineHandler'
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
  setupInlineGiftHandlers(bot)
  

  bot.catch((err) => {
    const ctx = err.ctx;
    logger.logError(`Error while handling update ${ctx.update.update_id}:`)
    
    const e = err.error;
    if (e instanceof GrammyError) {
      logger.logError("Error in request:", e.description)
    } else if (e instanceof HttpError) {
      logger.logError("Could not contact Telegram:", e)
    } else {
      logger.logError("Unknown error:", e)
    }
  })

  return bot
}
