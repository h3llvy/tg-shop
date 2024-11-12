import axios from 'axios'
import type { IUserProfile } from '@/shared/types/user'
import { telegramService } from '@/shared/services/telegram/telegramService'
import type { IUserGift } from '@/modules/gifts/types/userGift'

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
      // Если data - это строка, значит это прямой URL аватарки
      if (typeof data === 'string') {
        return data
      }
      // Иначе ищем URL в объекте data
      const avatarUrl = data?.url || data?.avatarUrl || data?.avatar?.url || data
      console.log('Получен ответ для аватарки:', { userId, data, avatarUrl })
      return avatarUrl
    } catch (error) {
      console.error('Ошибка получения аватара:', error)
      return null
    }
  }

  public async getFullProfileAsync(userId?: number): Promise<{
    profile: IUserProfile,
    gifts: IUserGift[]
  }> {
    try {
      const endpoint = userId 
        ? `/api/users/profile/full/${userId}`
        : '/api/users/profile/full'
        
      const { data } = await this.p_axiosInstance.get(endpoint)
      return data
    } catch (error) {
      console.error('Ошибка получения полного профиля:', error)
      throw error
    }
  }

  public async getGiftsHistoryAsync(): Promise<IUserGift[]> {
    try {
      const { data } = await this.p_axiosInstance.get('/api/users/gifts/history')
      return data
    } catch (error) {
      console.error('Ошибка получения истории подарков:', error)
      throw error
    }
  }
}

export const profileService = new ProfileService()
