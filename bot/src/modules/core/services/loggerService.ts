export class LoggerService {
  public logError(_error: Error | string, _context?: unknown): void {
    const timestamp = new Date().toISOString()
    const error = _error instanceof Error ? _error.message : _error
    const contextStr = _context ? `[Контекст: ${JSON.stringify(_context)}]` : ''
    console.error(`${timestamp} Ошибка: ${error} ${contextStr}`)
  }

  public logInfo(_message: string, _data?: unknown): void {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp} Инфо:`, _message, _data || '')
  }

  public logWarning(_message: string, _data?: unknown): void {
    const timestamp = new Date().toISOString()
    console.warn(`${timestamp} Предупреждение:`, _message, _data || '')
  }

  public logDebug(message: string, context?: any): void {
    console.log(new Date().toISOString(), 'Debug:', message, context ? `[Контекст: ${JSON.stringify(context)}]` : '')
  }
} 