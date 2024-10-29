export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface InitDataUnsafe {
  query_id?: string
  user?: TelegramUser
  auth_date?: string
  hash?: string
}

export interface IWebApp {
  initData: string
  initDataUnsafe: InitDataUnsafe
  colorScheme: 'light' | 'dark'
  viewportHeight: number
  viewportStableHeight: number
  isExpanded: boolean
  
  // Методы
  switchInlineQuery: (query: string, chatTypes?: string[]) => void
  expand: () => void
  close: () => void
  ready: () => void
  
  // События
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
}