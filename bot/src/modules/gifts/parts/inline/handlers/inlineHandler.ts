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
        const giftId = query.replace('gift_', '')
        const gift = await giftService.getGiftByIdAsync(giftId)
        gifts = gift ? [gift] : []
      } else {
        gifts = await giftService.getAllAsync()
      }

      const getGiftImage = (gift: IGift): string => {
        // Используем предопределенные изображения из конфигурации
        const giftImage = BOT_ASSETS.GIFT_IMAGES[gift.name as keyof typeof BOT_ASSETS.GIFT_IMAGES]
        if (giftImage) {
          return giftImage
        }
        // Если изображение не найдено в конфигурации, используем URL из gift
        if (gift.image?.startsWith('https://')) {
          return gift.image
        }
        // В крайнем случае используем плейсхолдер
        return `https://placehold.co/400x400/pink/white?text=${encodeURIComponent(gift.name)}`
      }

      const results: InlineQueryResultArticle[] = gifts.map((gift: IGift) => ({
        type: 'article',
        id: String(gift._id),
        title: gift.name,
        description: `Send ${gift.name} (${gift.prices.USDT} USDT)`,
        thumbnail_url: getGiftImage(gift),
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

      logger.logInfo('Подготовлены результаты для inline режима:', {
        count: results.length,
        firstResult: results[0]
      })

      await ctx.answerInlineQuery(results, {
        cache_time: 1,
        is_personal: true
      })
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}
