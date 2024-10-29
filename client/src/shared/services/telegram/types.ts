export interface IWebApp {
  initData: string
  initDataUnsafe: {
    user: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  colorScheme: 'light' | 'dark'
  switchInlineQuery: (query: string, chatTypes?: string[]) => void
}

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    Telegram?: {
      WebApp: IWebApp
    }
  }
} 