import axios from 'axios'
import type { IGift } from '../types/store'

class StoreService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/gifts`

  public async getGiftsAsync(): Promise<IGift[]> {
    const { data } = await axios.get<IGift[]>(this.baseUrl)
    return data
  }

  public async getGiftByIdAsync(id: string): Promise<IGift> {
    const { data } = await axios.get<IGift>(`${this.baseUrl}/${id}`)
    return data
  }
}

export const storeService = new StoreService() 