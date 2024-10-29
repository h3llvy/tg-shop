import type { HandlerBot } from '../../../types/bot'
import type { Context } from 'grammy'

export const setupHelpCommand = (bot: HandlerBot): void => {
  bot.command('help', async (ctx: Context) => {
    await ctx.reply(
      'Доступные команды:\n' +
      '/start - Начать работу с ботом\n' +
      '/help - Показать это сообщение'
    )
  })
}
