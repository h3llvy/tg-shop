import { HandlerBot } from '../../../../../types/bot'
import { BOT_ASSETS } from '../../../../core/config/assets'
import { giftService } from '../../../services/giftService'
import type { IGift } from '../../../types/gift'
import { LoggerService } from '../../../../core/services/loggerService'
import { InlineQueryResultArticle, ParseMode } from 'grammy/types'

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.on('inline_query', async (ctx) => {
    try {
      const query = ctx.inlineQuery.query
      logger.logInfo('Получен inline запрос:', { query })

      let gifts: IGift[] = []
      if (query.startsWith('gift_')) {
        // Если передан ID подарка
        const giftId = query.replace('gift_', '')
        const gift = await giftService.getGiftByIdAsync(giftId)
        gifts = gift ? [gift] : []
      } else {
        // Если запрос пустой или поисковый - показываем все доступные подарки
        gifts = await giftService.getAllAsync()
      }

      logger.logInfo('Найдены подарки для inline режима:', { 
        count: gifts.length,
        query 
      })

      const results: InlineQueryResultArticle[] = gifts.map((gift: IGift) => ({
        type: 'article',
        id: String(gift._id),
        title: gift.name,
        description: `Send ${gift.name} (${gift.prices.USDT} USDT)`,
        thumbnail_url: gift.image || BOT_ASSETS.AVATAR_URL,
        thumbnail_width: 100,
        thumbnail_height: 100,
        input_message_content: {
          message_text: `🎁 I have a gift for you!\n\n${gift.name}\n\nTap the button below to receive it.`,
          parse_mode: 'HTML' as ParseMode
        },
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🎁 Receive Gift',
              callback_data: `receive_gift:${gift._id}`
            }
          ]]
        }
      }))

      await ctx.answerInlineQuery(results, {
        cache_time: 1, // Кэшировать результат 1 секунду
        is_personal: true // Результаты персональные для каждого пользователя
      })
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}
