export class DatabaseConfig {
  public readonly mongoUri: string
  public readonly redisUri: string
  public readonly redisPassword: string

  constructor() {
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftshop'
    this.redisUri = process.env.REDIS_URI || 'redis://localhost:6379'
    this.redisPassword = process.env.REDIS_PASSWORD || 'secret'
  }
} 