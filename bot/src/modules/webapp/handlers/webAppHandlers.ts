import { HandlerBot } from '../../../types/bot'
import { Context } from 'grammy'

export function setupWebAppHandlers(bot: HandlerBot) {
  // Обработка данных из веб-приложения
  bot.on('message:web_app_data', async (ctx: Context) => {
    console.log('Получены данные из WebApp:', ctx.message?.web_app_data)
    await ctx.reply('Данные из веб-приложения получены!')
  })
}
