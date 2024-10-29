import { Context } from 'grammy'
import { InlineQueryResult } from '@grammyjs/types'
import { HandlerBot } from '../../../types/bot'

export function setupInlineHandlers(bot: HandlerBot) {
  bot.on('inline_query', async (ctx: Context) => {
    try {
      const results: InlineQueryResult[] = [
        {
          type: 'article',
          id: '1',
          title: 'Отправить подарок',
          description: 'Нажмите, чтобы отправить подарок',
          thumbnail_url: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
          input_message_content: {
            message_text: '🎁 Хочу отправить подарок!\n\nНажмите на кнопку ниже, чтобы открыть магазин подарков.'
          },
          reply_markup: {
            inline_keyboard: [[
              {
                text: '🎁 Открыть магазин подарков',
                url: 'https://t.me/giftcry_bot/start' // Используем прямую ссылку на бота
              }
            ]]
          }
        },
        {
          type: 'article',
          id: '2',
          title: 'Мои подарки',
          description: 'Посмотреть мои подарки',
          thumbnail_url: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
          input_message_content: {
            message_text: '🎁 Мои подарки'
          }
        }
      ]

      await ctx.answerInlineQuery(results, {
        cache_time: 300,
        is_personal: true
      })
    } catch (error) {
      console.error('Ошибка inline режима:', error)
    }
  })
}
