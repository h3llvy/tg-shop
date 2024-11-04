import 'dotenv/config'
import { Bot } from 'grammy'
import type { BotContext } from './types/bot'
import { config } from './config'
import { setupBot } from './modules/core/setupBot'

const bot = new Bot<BotContext>(config.BOT_TOKEN)
const configuredBot = setupBot(bot)

configuredBot.start()
