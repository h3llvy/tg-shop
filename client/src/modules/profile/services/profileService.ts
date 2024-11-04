import axios from 'axios'
import type { IUserProfile } from '@/shared/types/user'

export class ProfileService {
  private readonly p_apiUrl: string

  constructor() {
    this.p_apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  }

  public async getUserProfileAsync(): Promise<IUserProfile> {
    const { data } = await axios.get(`${this.p_apiUrl}/api/users/profile`)
    return data
  }

  public async getUserAvatarAsync(userId: number): Promise<string | null> {
    try {
      // Теперь используем единый эндпоинт для аватарок
      const { data } = await axios.get(`${this.p_apiUrl}/api/users/avatar/${userId}`)
      return data.url || data.avatarUrl || null
    } catch (error) {
      console.error('Ошибка получения аватара:', error)
      return null
    }
  }

  public async updateProfileAsync(_update: Partial<IUserProfile>): Promise<IUserProfile> {
    const { data } = await axios.patch(`${this.p_apiUrl}/api/users/profile`, _update)
    return data
  }
}

export const profileService = new ProfileService()
