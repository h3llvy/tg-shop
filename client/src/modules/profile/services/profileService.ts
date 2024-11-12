import axios from 'axios'
import type { IUserProfile } from '@/shared/types/user'
import { telegramService } from '@/shared/services/telegram/telegramService'

export class ProfileService {
  private readonly p_apiUrl: string
  private readonly p_axiosInstance

  constructor() {
    this.p_apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    
    // Создаем настроенный экземпляр axios
    this.p_axiosInstance = axios.create({
      baseURL: this.p_apiUrl,
      headers: {
        ...telegramService.getAuthHeaders()
      }
    })
  }

  public async getUserProfileAsync(): Promise<IUserProfile> {
    try {
      const { data } = await this.p_axiosInstance.get('/api/users/profile')
      return data
    } catch (error) {
      console.error('Ошибка получения профиля:', error)
      throw error
    }
  }

  public async getUserAvatarAsync(userId: number): Promise<string | null> {
    try {
      const { data } = await this.p_axiosInstance.get(`/api/users/avatar/${userId}`)
      return data.url || data.avatarUrl || null
    } catch (error) {
      console.error('Ошибка получения аватара:', error)
      return null
    }
  }
}

export const profileService = new ProfileService()
