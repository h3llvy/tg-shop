declare namespace Telegram {
  interface WebAppUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }

  interface WebAppInitData {
    query_id?: string
    user?: WebAppUser
    receiver?: WebAppUser
    start_param?: string
  }

  interface MainButtonParams {
    text: string
    color: string
    text_color: string
    is_visible: boolean
    is_active: boolean
  }

  interface SecondaryButtonParams extends MainButtonParams {
    position: string
  }

  interface BackButton {
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }

  interface MainButton {
    text: string
    color: string
    text_color: string
    is_visible: boolean
    is_active: boolean
    is_progress_visible: boolean
    
    show(): void
    hide(): void
    enable(): void
    disable(): void
    showProgress(leaveActive: boolean): void
    hideProgress(): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
    setParams(params: MainButtonParams): void
  }

  interface SecondaryButton {
    show: () => void
    hide: () => void
    setParams: (params: SecondaryButtonParams) => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }

  interface WebApp {
    initData: string
    initDataUnsafe: WebAppInitData
    colorScheme: 'light' | 'dark'
    viewportHeight: number
    viewportStableHeight: number
    isExpanded: boolean
    BackButton: BackButton
    MainButton: MainButton
    SecondaryButton: SecondaryButton
    ready: () => void
    expand: () => void
    close: () => void
    switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
    openTelegramLink: (url: string) => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: Telegram.WebApp
    }
  }
}

export {} 