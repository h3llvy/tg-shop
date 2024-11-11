import axios from 'axios'
import { LoggerService } from './loggerService'

interface IUser {
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  languageCode: string
}

export class UserService {
  private readonly apiUrl: string
  private readonly logger: LoggerService

  constructor() {
    this.apiUrl = process.env.SERVER_URL || ''
    this.logger = new LoggerService()
  }

  public async createOrUpdateUserAsync(user: IUser): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/users`, user)
    } catch (error) {
      this.logger.logError('Error creating/updating user:', error)
      throw error
    }
  }
} 