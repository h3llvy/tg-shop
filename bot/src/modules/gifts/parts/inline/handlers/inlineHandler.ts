import { HandlerBot } from '../../../../../types/bot'
import { LoggerService } from '../../../../core/services/loggerService'
import type { InlineQueryResultArticle } from 'grammy/types'
import axios from 'axios'

// Используем SERVER_URL из env
const API_URL = process.env.SERVER_URL || 'https://local-tuna-server.ru.tuna.am'
const DEFAULT_THUMBNAIL = `${API_URL}/static/avatar.png`

export const setupInlineGiftHandlers = (bot: HandlerBot): void => {
  const logger = new LoggerService()

  // Обработка inline запросов для отправки подарка
  bot.on('inline_query', async (ctx) => {
    try {
      const giftId = ctx.inlineQuery.query.trim()
      
      if (!giftId || !giftId.match(/^[0-9a-fA-F]{24}$/)) {
        await ctx.answerInlineQuery([])
        return
      }

      logger.logInfo('Получен inline запрос:', {
        giftId,
        apiUrl: API_URL
      })

      // Получаем информацию о подарке
      const response = await axios.get(`${API_URL}/api/gifts/inline/${giftId}`)
      const gift = response.data

      if (!gift) {
        logger.logWarning('Gift not found for inline query:', { giftId })
        await ctx.answerInlineQuery([])
        return
      }

      const results: InlineQueryResultArticle[] = [{
        type: 'article',
        id: giftId,
        title: `Отправить подарок: ${gift.name}`,
        description: 'Нажмите чтобы отправить подарок',
        thumbnail_url: gift.image || DEFAULT_THUMBNAIL,
        reply_markup: {
          inline_keyboard: [[
            { text: 'Receive Gift', callback_data: `receive_gift:${giftId}` }
          ]]
        },
        input_message_content: {
          message_text: `🎁 У меня есть подарок для тебя!\nНажми на кнопку ниже чтобы получить: ${gift.name}`
        }
      }]

      await ctx.answerInlineQuery(results, { 
        cache_time: 300,
        is_personal: true
      })
    } catch (error) {
      logger.logError('Error in inline query handler:', error)
      // Отвечаем пустым результатом в случае ошибки
      await ctx.answerInlineQuery([])
    }
  })

  // Обработка нажатия на кнопку Receive Gift
  bot.callbackQuery(/^receive_gift:(.+)$/, async (ctx) => {
    try {
      const giftId = ctx.match[1]
      const userId = ctx.from.id
      
      // Вызываем API для получения подарка
      await axios.post(`${API_URL}/api/gifts/${giftId}/receive`, {
        userId
      })

      await ctx.answerCallbackQuery({
        text: 'Подарок успешно получен! 🎉',
        show_alert: true
      })

      // Обновляем сообщение, убирая кнопку
      await ctx.editMessageText(
        `🎁 Подарок получен пользователем ${ctx.from.first_name}!`,
        {
          reply_markup: { inline_keyboard: [] }
        }
      )
    } catch (error) {
      logger.logError('Error receiving gift:', error)
      await ctx.answerCallbackQuery({
        text: 'Ошибка при получении подарка',
        show_alert: true
      })
    }
  })
}