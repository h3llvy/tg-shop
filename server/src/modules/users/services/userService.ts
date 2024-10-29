import axios from 'axios'
import type { IUserAvatar } from '../types/user'

export class UserService {
  private readonly p_botToken: string

  constructor() {
    const token = process.env.BOT_TOKEN
    if (!token) {
      throw new Error('Не задан BOT_TOKEN')
    }
    this.p_botToken = token
  }

  public async getUserAvatarAsync(_userId: number): Promise<IUserAvatar> {
    try {
      const photosResponse = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getUserProfilePhotos`,
        {
          params: {
            user_id: _userId,
            limit: 1
          }
        }
      )

      if (!photosResponse.data.ok || !photosResponse.data.result.photos.length) {
        return { avatarUrl: null }
      }

      const fileId = photosResponse.data.result.photos[0][0].file_id
      const fileResponse = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getFile`,
        {
          params: { file_id: fileId }
        }
      )

      if (!fileResponse.data.ok) {
        return { avatarUrl: null }
      }

      return { 
        avatarUrl: `https://api.telegram.org/file/bot${this.p_botToken}/${fileResponse.data.result.file_path}` 
      }
    } catch (error) {
      console.error('Ошибка при получении аватара:', error)
      return { avatarUrl: null }
    }
  }
}
