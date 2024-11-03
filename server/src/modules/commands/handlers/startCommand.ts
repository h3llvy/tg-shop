import { Bot as HandlerBot, Context } from 'grammy'
import { UserRepository } from '../../database/repositories/userRepository'

export const setupStartCommand = (bot: HandlerBot): void => {
  bot.command('start', async (ctx: Context) => {
    try {
      const userRepository = new UserRepository()
      
      if (!ctx.from) {
        await ctx.reply('Ошибка: не удалось получить данные пользователя')
        return
      }
      
      // Проверяем существует ли пользователь
      const existingUser = await userRepository.findByTelegramIdAsync(ctx.from.id)
      
      if (!existingUser) {
        // Создаем нового пользователя
        await userRepository.createAsync({
          telegramId: ctx.from.id,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name || undefined,
          username: ctx.from.username || undefined,
          languageCode: ctx.from.language_code || undefined
        })
      }
      
      const keyboard = {
        inline_keyboard: [[
          {
            text: 'Открыть магазин подарков',
            web_app: { url: process.env.WEBAPP_URL || '' }
          }
        ]]
      }

      await ctx.reply(
        'Добро пожаловать в магазин подарков! 🎁\n\n' +
        'Здесь вы можете покупать и отправлять подарки другим пользователям Telegram.',
        { reply_markup: keyboard }
      )
    } catch (error) {
      console.error('Ошибка в команде start:', error)
      await ctx.reply('Произошла ошибка при запуске бота. Пожалуйста, попробуйте позже.')
    }
  })
} 