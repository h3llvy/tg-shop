import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { LoggerService } from '../../core/services/loggerService'
export class WebSocketService {
  private static instance: WebSocketService | null = null
  private readonly p_logger: LoggerService
  private io: SocketServer | null = null

  private constructor() {
    this.p_logger = new LoggerService()
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      path: '/ws',
      cors: {
        origin: process.env.WEBAPP_URL,
        methods: ['GET', 'POST']
      }
    })
    
    this.io.on('connection', (socket) => {
      const userId = socket.handshake.query.userId
      if (userId) {
        socket.join(`user_${userId}`)
        this.p_logger.logInfo(`Socket.IO клиент подключен: ${userId}`)
        
        socket.on('disconnect', () => {
          this.p_logger.logInfo(`Socket.IO клиент отключен: ${userId}`)
        })
      }
    })
  }

  public sendPaymentSuccess(userId: number, giftData: any): void {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('payment_success', giftData)
      this.p_logger.logInfo(`Отправлено уведомление об оплате для userId: ${userId}`)
    }
  }
}
