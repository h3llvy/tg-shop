import type { HandlerBot } from '../../../types/bot'
import type { Context } from 'grammy'

const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID

export const setupHelpCommand = (bot: HandlerBot): void => {
  bot.command('help', async (ctx: Context) => {
    try {
      const user = ctx.from
      if (!user) {
        await ctx.reply('Ошибка: не удалось получить данные пользователя')
        return
      }

      // Сообщение пользователю
      await ctx.reply(
        '🎁 Спасибо за обращение в поддержку!\n\n' +
        'Ваш запрос принят и будет обработан в ближайшее время.\n\n' +
        'Пока вы ждете ответа, вы можете:\n' +
        '• Просмотреть доступные подарки\n' +
        '• Проверить статус заказа\n' +
        '• Посмотреть историю покупок'
      )

      // Сообщение в поддержку
      const supportMessage = 
        `🆘 Новое обращение в поддержку\n\n` +
        `👤 Пользователь: ${user.first_name} ${user.last_name || ''}\n` +
        `🔍 Username: @${user.username || 'отсутствует'}\n` +
        `🆔 ID: ${user.id}\n` +
        `🌐 Язык: ${user.language_code || 'не указан'}`

      if (SUPPORT_CHAT_ID) {
        await ctx.api.sendMessage(SUPPORT_CHAT_ID, supportMessage, {
          reply_markup: {
            inline_keyboard: [[
              {
                text: '📝 Ответить пользователю',
                url: `tg://user?id=${user.id}`
              }
            ]]
          }
        })
      }
    } catch (error) {
      console.error('Ошибка в команде help:', error)
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.')
    }
  })
}