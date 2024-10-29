import type { IWebApp } from './types'

class TelegramService {
  public readonly webApp: IWebApp

  constructor() {
    if (!window.Telegram?.WebApp) {
      throw new Error('Telegram WebApp is not available')
    }
    this.webApp = window.Telegram.WebApp
  }

  // Методы, которых нет в SDK
  public switchInlineQuery(query: string, chatTypes?: string[]) {
    this.webApp.switchInlineQuery(query, chatTypes)
  }

  public get initData() {
    return this.webApp.initData
  }

  public get user() {
    return this.webApp.initDataUnsafe.user
  }

  public get isDark() {
    return this.webApp.colorScheme === 'dark'
  }
}

export const telegramService = new TelegramService() 