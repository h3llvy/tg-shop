import mongoose from 'mongoose'
import { config } from '../../../config'
import { LoggerService } from '../../core/services/loggerService'

export class DatabaseService {
  private static p_instance: DatabaseService
  private readonly p_logger: LoggerService

  private constructor() {
    this.p_logger = new LoggerService()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.p_instance) {
      DatabaseService.p_instance = new DatabaseService()
    }
    return DatabaseService.p_instance
  }

  public async connectAsync(): Promise<void> {
    try {
      await mongoose.connect(config.MONGODB_URI)
      this.p_logger.logInfo('✅ MongoDB подключена')
    } catch (error) {
      this.p_logger.logError('❌ Ошибка подключения к MongoDB:', error)
      throw error
    }
  }
} 