export class LoggerService {
  private context: string

  constructor(context: string = '') {
    this.context = context
  }

  public logInfo(message: string, data?: any): void {
    console.log(`[${this.context}] ${message}`, data || '')
  }

  public logError(message: string, error?: any): void {
    console.error(`[${this.context}] ${message}`, error || '')
  }

  public logWarning(message: string, data?: any): void {
    console.warn(`[${this.context}] ${message}`, data || '')
  }
} 