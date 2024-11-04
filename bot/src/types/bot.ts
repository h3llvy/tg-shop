import type { Context, SessionFlavor } from 'grammy'
import type { Bot } from 'grammy'

export interface SessionData {
  step: 'idle' | 'awaiting_gift' | 'awaiting_recipient'
  giftData: {
    id?: string
    recipientId?: number
  } | null
}

export type BotContext = Context & SessionFlavor<SessionData>
export type HandlerBot = Bot<BotContext>

export interface IBotConfig {
  token: string
  webhookUrl?: string
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export interface ICommandHandler {
  command: string
  handler: (ctx: BotContext) => Promise<void>
}
