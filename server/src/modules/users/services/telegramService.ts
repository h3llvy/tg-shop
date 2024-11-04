import axios from 'axios'
import { LoggerService } from '../../core/services/loggerService'

export class TelegramService {
  private readonly p_botToken: string
  private readonly p_logger: LoggerService

  constructor() {
    this.p_botToken = process.env.BOT_TOKEN || ''
    this.p_logger = new LoggerService()
  }

  public async getUserAvatarUrlAsync(_userId: number): Promise<string | null> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getUserProfilePhotos`,
        {
          params: {
            user_id: _userId,
            limit: 1
          }
        }
      )

      const photos = response.data.result.photos
      if (!photos || !photos.length) {
        return null
      }

      const fileId = photos[0][0].file_id
      const fileResponse = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getFile`,
        {
          params: { file_id: fileId }
        }
      )

      const filePath = fileResponse.data.result.file_path
      return `https://api.telegram.org/file/bot${this.p_botToken}/${filePath}`
    } catch (error) {
      this.p_logger.logError('Ошибка получения аватара:', error)
      return null
    }
  }
} 