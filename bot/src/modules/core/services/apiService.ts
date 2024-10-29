import axios from 'axios'
import { config } from '../../../config'
import type { IGift, IGiftPurchase } from '../../gifts/types/gift'

const api = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const apiService = {
  async verifyPaymentAsync(_paymentId: string): Promise<boolean> {
    const { data } = await api.post('/api/payments/verify', { paymentId: _paymentId })
    return data.verified
  },

  async getGiftAsync(_giftId: string): Promise<IGift> {
    const { data } = await api.get(`/api/gifts/${_giftId}`)
    return data
  },

  async getAllGiftsAsync(): Promise<IGift[]> {
    const { data } = await api.get('/api/gifts')
    return data
  },

  async purchaseGiftAsync(_purchase: IGiftPurchase): Promise<IGift> {
    const { data } = await api.post(`/api/gifts/${_purchase.giftId}/purchase`, _purchase)
    return data
  },

  async sendGiftAsync(_giftId: string, _recipientId: string): Promise<IGift> {
    const { data } = await api.post(`/api/gifts/${_giftId}/send`, { recipientId: _recipientId })
    return data
  },

  async createGiftAsync(_giftData: Partial<IGift>): Promise<IGift> {
    const { data } = await api.post('/api/gifts', _giftData)
    return data
  }
}
