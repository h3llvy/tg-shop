declare namespace Telegram {
  interface WebAppUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
  }

  interface WebAppInitData {
    query_id?: string
    user?: WebAppUser
    receiver?: WebAppUser
    start_param?: string
    auth_date?: string
    hash?: string
  }

  interface BackButton {
    isVisible: boolean
    show(): void
    hide(): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
  }

  interface WebApp {
    ready(): void
    expand(): void
    close(): void
    
    initData: string
    initDataUnsafe: WebAppInitData
    colorScheme: 'light' | 'dark'
    viewportHeight: number
    viewportStableHeight: number
    isExpanded: boolean
    BackButton: BackButton
    openInvoice(url: string): Promise<void>
    showPopup(params: PopupParams): Promise<string>
    showAlert(message: string): Promise<void>
    showConfirm(message: string): Promise<boolean>
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: Telegram.WebApp
    }
  }
} 