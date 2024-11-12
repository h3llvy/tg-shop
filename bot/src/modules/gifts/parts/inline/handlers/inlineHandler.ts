import { HandlerBot } from '../../../../../types/bot'
import { LoggerService } from '../../../../core/services/loggerService'
import type { InlineQueryResultArticle } from 'grammy/types'

const DEFAULT_THUMBNAIL = 'https://local-tuna-server.ru.tuna.am/static/avatar.png'

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.on('inline_query', async (ctx) => {
    try {
      const giftId = ctx.inlineQuery.query.trim()
      if (!giftId) {
        await ctx.answerInlineQuery([])
        return
      }

      const results: InlineQueryResultArticle[] = [{
        type: 'article',
        id: giftId,
        title: 'Send Gift',
        description: `Send a gift of ID: ${giftId}`,
        thumbnail_url: DEFAULT_THUMBNAIL,
        input_message_content: {
          message_text: `🎁 Send a gift of ID: ${giftId}`
        }
      }]

      await ctx.answerInlineQuery(results, { cache_time: 300, is_personal: true })
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}