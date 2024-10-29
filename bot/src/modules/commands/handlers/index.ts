import type { HandlerBot } from '../../../types/bot'
import { setupStartCommand } from './startCommand'
import { setupHelpCommand } from './helpCommand'

export const setupCommandHandlers = (bot: HandlerBot): void => {
  setupStartCommand(bot)
  setupHelpCommand(bot)
}
