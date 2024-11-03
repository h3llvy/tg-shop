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
    const maxRetries = 5;
    const retryDelay = 5000;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Подключение к MongoDB
        await mongoose.connect(this.p_config.mongoUri, {
          authSource: 'admin',
          retryWrites: true,
          w: 'majority',
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000
        })

        console.log('✅ MongoDB подключена успешно')
        await this.logMongoDBInfo()

        // Подключение к Redis
        this.p_redisClient = new Redis({
          host: this.p_config.redisHost,
          port: this.p_config.redisPort,
          password: this.p_config.redisPassword,
          retryStrategy: (times) => {
            if (times > maxRetries) return null;
            return Math.min(times * 1000, retryDelay);
          },
          maxRetriesPerRequest: 3
        });

        await new Promise((resolve, reject) => {
          this.p_redisClient!.on('connect', resolve);
          this.p_redisClient!.on('error', reject);
        });

        console.log('✅ Redis подключен успешно')
        return;

      } catch (error) {
        console.error(`❌ Попытка подключения ${retries + 1}/${maxRetries} не удалась:`, error)
        retries++;
        if (retries === maxRetries) {
          throw new Error('Превышено максимальное количество попыток подключения');
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
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