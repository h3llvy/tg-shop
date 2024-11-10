import { HandlerBot } from '../../../../../types/bot'
import { BOT_ASSETS } from '../../../../core/config/assets'
import { giftService } from '../../../services/giftService'
import { InlineQueryResultArticle } from 'grammy/types'

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  bot.on('inline_query', async (ctx) => {
    try {
      const query = ctx.inlineQuery.query
      
      if (!query) {
        return await ctx.answerInlineQuery([])
      }

      const gift = await giftService.getGiftByIdAsync(query)
      
      if (!gift) {
        return await ctx.answerInlineQuery([])
      }

      const result: InlineQueryResultArticle[] = [{
        type: 'article',
        id: String(gift.id),
        title: 'Send Gift',
        description: `Send a gift of ${gift.name}`,
        thumbnail_url: BOT_ASSETS.AVATAR_URL,
        input_message_content: {
          message_text: `🎁 ${gift.name}\n\nTap to view this gift!`,
          parse_mode: 'HTML'
        },
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🎁 View Gift',
              callback_data: `view_gift:${gift.id}`
            }
          ]]
        }
      }]

      await ctx.answerInlineQuery(result)
    } catch (error) {
      console.error('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}
