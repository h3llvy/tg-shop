import axios from 'axios'
import type { IUserProfile } from '@/shared/types/user'

export class ProfileService {
  private readonly p_apiUrl: string

  constructor() {
    this.p_apiUrl = import.meta.env.VITE_API_URL
  }

  public async getUserProfileAsync(): Promise<IUserProfile> {
    const { data } = await axios.get(`${this.p_apiUrl}/api/users/profile`)
    return data
  }

  public async getUserAvatarAsync(): Promise<string | null> {
    try {
      const { data } = await axios.get(`${this.p_apiUrl}/api/users/avatar`)
      return data.url
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
