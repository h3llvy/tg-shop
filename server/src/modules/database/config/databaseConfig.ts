export class DatabaseConfig {
  public readonly mongoUri: string
  public readonly redisHost: string
  public readonly redisPort: number
  public readonly redisPassword: string

  constructor() {
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftshop'
    this.redisHost = process.env.REDIS_HOST || 'localhost'
    this.redisPort = Number(process.env.REDIS_PORT) || 6379
    this.redisPassword = process.env.REDIS_PASSWORD || 'secret'
  }
}