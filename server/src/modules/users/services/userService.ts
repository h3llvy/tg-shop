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
    console.log('Начало получения аватара для пользователя:', _userId)
    try {
      console.log('Запрос фотографий профиля из Telegram API...')
      const photosResponse = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getUserProfilePhotos`,
        {
          params: {
            user_id: _userId,
            limit: 1
          }
        }
      )
      console.log('Ответ от Telegram API (getUserProfilePhotos):', photosResponse.data)
  
      if (!photosResponse.data.ok || !photosResponse.data.result.photos.length) {
        console.log('Фотографии профиля не найдены')
        return { avatarUrl: null }
      }
  
      const fileId = photosResponse.data.result.photos[0][0].file_id
      console.log('Получен file_id:', fileId)
  
      console.log('Запрос информации о файле из Telegram API...')
      const fileResponse = await axios.get(
        `https://api.telegram.org/bot${this.p_botToken}/getFile`,
        {
          params: { file_id: fileId }
        }
      )
      console.log('Ответ от Telegram API (getFile):', fileResponse.data)
  
      if (!fileResponse.data.ok) {
        console.log('Не удалось получить информацию о файле')
        return { avatarUrl: null }
      }
  
      const avatarUrl = `https://api.telegram.org/file/bot${this.p_botToken}/${fileResponse.data.result.file_path}`
      console.log('Сформирован URL аватара:', avatarUrl)
      return { avatarUrl }
    } catch (error) {
      console.error('Ошибка при получении аватара:', error)
      return { avatarUrl: null }
    }
  }
}
