import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private static instance: WebSocketService | null = null
  private socket: Socket | null = null
  private paymentSuccessHandlers: Set<Function> = new Set()
  private isInitialized = false
  private connectHandlers: Set<Function> = new Set()
  private disconnectHandlers: Set<Function> = new Set()
  private errorHandlers: Set<Function> = new Set()

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  public connect(userId: number): void {
    if (this.isInitialized) {
      console.log('WebSocket уже инициализирован')
      return
    }

    try {
      const wsUrl = import.meta.env.VITE_API_URL
      console.log('Подключение к WebSocket:', wsUrl)

      this.socket = io(wsUrl, {
        path: '/ws',
        query: { userId: userId.toString() },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket']
      })

      this.setupEventListeners()
      this.isInitialized = true
    } catch (error) {
      console.error('Ошибка подключения к WebSocket:', error)
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket.IO подключен, id:', this.socket?.id)
      this.connectHandlers.forEach(handler => handler())
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO отключен:', reason)
      this.disconnectHandlers.forEach(handler => handler(reason))
    })

    this.socket.on('connect_error', (error) => {
      console.error('Ошибка подключения Socket.IO:', error)
      this.errorHandlers.forEach(handler => handler(error))
    })

    this.socket.on('payment_success', (data) => {
      console.log('Получено уведомление об оплате:', data)
      this.paymentSuccessHandlers.forEach(handler => handler(data))
    })
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isInitialized = false
    }
  }

  public onPaymentSuccess(handler: Function): void {
    console.log('Добавлен обработчик payment_success')
    this.paymentSuccessHandlers.add(handler)
  }

  public offPaymentSuccess(handler: Function): void {
    this.paymentSuccessHandlers.delete(handler)
  }

  public onConnect(handler: Function): void {
    this.connectHandlers.add(handler)
  }

  public onDisconnect(handler: Function): void {
    this.disconnectHandlers.add(handler)
  }

  public onError(handler: Function): void {
    this.errorHandlers.add(handler)
  }
}

export const webSocketService = WebSocketService.getInstance()