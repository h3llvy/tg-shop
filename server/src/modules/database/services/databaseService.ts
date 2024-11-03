import mongoose from 'mongoose'
import Redis from 'ioredis'
import { DatabaseConfig } from '../config/databaseConfig'

export class DatabaseService {
  private static p_instance: DatabaseService
  private readonly p_config: DatabaseConfig
  private p_redisClient?: Redis

  private constructor() {
    this.p_config = new DatabaseConfig()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.p_instance) {
      DatabaseService.p_instance = new DatabaseService()
    }
    return DatabaseService.p_instance
  }

  public async connectAsync(): Promise<void> {
    try {
      // Подключение к MongoDB
      await mongoose.connect(this.p_config.mongoUri, {
        authSource: 'admin',
        retryWrites: true,
        w: 'majority'
      })

      console.log('✅ MongoDB подключена успешно')
      await this.logMongoDBInfo()

      // Подключение к Redis
      this.p_redisClient = new Redis({
        host: this.p_config.redisHost,
        port: this.p_config.redisPort,
        password: this.p_config.redisPassword
      });
      
      this.p_redisClient.on('connect', () => {
        console.log('✅ Redis подключен успешно')
      })

      this.p_redisClient.on('error', (err) => {
        console.error('❌ Ошибка Redis:', err)
      })

    } catch (error) {
      console.error('❌ Ошибка подключения к базам данных:', error)
      throw error
    }
  }

  private async logMongoDBInfo(): Promise<void> {
    try {
      // Проверяем, что соединение установлено
      if (!mongoose.connection || !mongoose.connection.db) {
        console.log('MongoDB информация недоступна - нет соединения')
        return
      }

      const adminDb = mongoose.connection.db.admin()
      const serverInfo = await adminDb.serverStatus()
      
      console.log('MongoDB информация:')
      console.log(`Версия: ${serverInfo.version}`)
      console.log(`Подключения: ${serverInfo.connections.current} из ${serverInfo.connections.available}`)
      console.log(`Имя базы данных: ${mongoose.connection.name}`)

      // Дополнительная проверка состояния
      const state = mongoose.connection.readyState
      console.log('Состояние подключения:', {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
      }[state])

    } catch (error) {
      console.error('Ошибка получения информации о MongoDB:', error)
    }
  }

  public getRedisClient(): Redis | undefined {
    return this.p_redisClient
  }

  // Добавляем метод для проверки состояния подключения
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1 && !!this.p_redisClient
  }
} 