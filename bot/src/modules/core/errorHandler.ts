import type { Bot } from 'grammy'
import { GrammyError, HttpError } from 'grammy'
import type { BotContext } from '../../types/bot'
import { LoggerService } from './services/loggerService'
import { BotError } from './errors/customErrors'

export const setupErrorHandling = (bot: Bot<BotContext>): void => {
  const logger = new LoggerService()

  bot.catch((err) => {
    const ctx = err.ctx
    const error = err.error
    const updateId = ctx.update.update_id

    logger.logError(
      new Error(`Ошибка при обработке update ${updateId}`),
      { error, updateId }
    )

    if (error instanceof GrammyError) {
      logger.logError(error, 'GrammyError')
    } else if (error instanceof HttpError) {
      logger.logError(error, 'HttpError')
    } else if (error instanceof BotError) {
      logger.logError(error, 'BotError')
    } else {
      logger.logError(error as Error, 'UnknownError')
    }
  })
}
