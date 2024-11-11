import { HandlerBot } from '../../../../../types/bot'
import { giftService } from '../../../services/giftService'
import { LoggerService } from '../../../../core/services/loggerService'
import type { InlineQueryResultArticle } from 'grammy/types'
import type { IUserGift } from '../../../types/userGift'

// Используем прямую ссылку на аватарку
const DEFAULT_THUMBNAIL = 'https://local-tuna-server.ru.tuna.am/static/avatar.png'

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  bot.on('inline_query', async (ctx) => {
    try {
      const userId = ctx.from?.id
      if (!userId) {
        logger.logWarning('Отсутствует ID пользователя в inline запросе')
        await ctx.answerInlineQuery([])
        return
      }

      const username = ctx.from?.username

      logger.logInfo('Получен inline запрос:', {
        userId,
        username,
        query: ctx.inlineQuery.query
      })

      // Получаем только подарки текущего пользователя
      const userGifts = await giftService.getUserGiftsAsync(userId)
      
      // Фильтруем только купленные подарки
      const availableGifts = userGifts.filter((gift: IUserGift) => 
        gift.status === 'purchased' && 
        gift.userId === userId
      )

      const results: InlineQueryResultArticle[] = availableGifts.map((userGift: IUserGift) => ({
        type: 'article' as const,
        id: String(userGift._id),
        title: userGift.gift.name,
        description: `Send ${userGift.gift.name} (Purchased on ${new Date(userGift.purchaseDate).toLocaleDateString()})`,
        thumbnail_url: DEFAULT_THUMBNAIL,
        thumbnail_width: 64,
        thumbnail_height: 64,
        input_message_content: {
          message_text: `🎁 ${userGift.gift.name}\n\nTap the button below to receive your gift!`,
          parse_mode: 'HTML'
        },
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🎁 Receive Gift',
              callback_data: `receive_gift:${userGift._id}`
            }
          ]]
        }
      }))

      logger.logInfo('Отправка inline результатов:', {
        resultsCount: results.length,
        userId,
        firstResult: results[0] ? {
          id: results[0].id,
          type: results[0].type,
          thumbnail_url: results[0].thumbnail_url
        } : null
      })

      await ctx.answerInlineQuery(results, {
        cache_time: 1,
        is_personal: true,
        switch_pm_text: 'Open Gift Shop',
        switch_pm_parameter: 'gifts'
      } as any)
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      await ctx.answerInlineQuery([])
    }
  })
}
