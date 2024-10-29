import { Bot, Context, SessionFlavor } from 'grammy'

export interface SessionData {
  step: string;
  giftData: any | null;
}

export type BotContext = Context & SessionFlavor<SessionData>;

// Экспортируем тип для обработчиков
export type HandlerBot = Bot<BotContext>;

export interface IBotConfig {
  token: string
  webhookUrl?: string
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export interface ICommandHandler {
  command: string
  handler: (ctx: BotContext) => Promise<void>
}
