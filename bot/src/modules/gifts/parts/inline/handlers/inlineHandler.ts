import { HandlerBot } from '../../../../../types/bot'
import { LoggerService } from '../../../../core/services/loggerService'
import type { InlineQueryResultArticle } from 'grammy/types'
import axios from 'axios'

const DEFAULT_THUMBNAIL = 'https://example.com/gift-thumbnail.png'

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.on('inline_query', async (ctx) => {
    try {
      const giftId = ctx.inlineQuery.query.trim()
      
      // Если запрос пустой или не соответствует формату ID подарка,
      // возвращаем пустой результат
      if (!giftId || !giftId.match(/^[0-9a-fA-F]{24}$/)) {
        await ctx.answerInlineQuery([])
        return
      }

      // Получаем информацию о подарке с сервера
      const response = await axios.get(`${process.env.API_URL}/api/gifts/${giftId}`)
      const gift = response.data

      if (!gift) {
        await ctx.answerInlineQuery([])
        return
      }

      const results: InlineQueryResultArticle[] = [{
        type: 'article',
        id: giftId,
        title: gift.name,
        description: `Отправить подарок: ${gift.name}`,
        thumbnail_url: gift.image || DEFAULT_THUMBNAIL,
        input_message_content: {
          message_text: `🎁 Вам отправлен подарок: ${gift.name}`
        }
      }]

      await ctx.answerInlineQuery(results, { 
        cache_time: 300,
        is_personal: true
      })
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}