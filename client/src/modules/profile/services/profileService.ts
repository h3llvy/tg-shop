import axios from 'axios'
import type { IUserProfile } from '@/shared/types/user'

export class ProfileService {
  private readonly p_apiUrl: string
  private readonly p_botUrl: string

  constructor() {
    this.p_apiUrl = import.meta.env.VITE_API_URL
    this.p_botUrl = import.meta.env.VITE_BOT_API_URL
  }

  public async getUserProfileAsync(): Promise<IUserProfile> {
    const { data } = await axios.get(`${this.p_apiUrl}/api/users/profile`)
    return data
  }

  public async getUserAvatarAsync(userId: number): Promise<string | null> {
    try {
      // Сначала пробуем получить через бота
      const { data } = await axios.get(`${this.p_botUrl}/api/users/avatar/${userId}`)
      if (data.url) {
        return data.url
      }

      // Если не получилось, пробуем через сервер
      const serverResponse = await axios.get(`${this.p_apiUrl}/api/users/me/avatar`)
      return serverResponse.data.url
    } catch {
      return null
    }
  }

  public async updateProfileAsync(_update: Partial<IUserProfile>): Promise<IUserProfile> {
    const { data } = await axios.patch(`${this.p_apiUrl}/api/users/profile`, _update)
    return data
  }
}

export const profileService = new ProfileService()
