import type { IGift } from './gift'

export interface IUserGift {
  _id: string
  userId: number
  gift: IGift
  purchaseDate: string
  status: 'purchased' | 'sent' | 'received'
  recipientId?: number
  sentDate?: string
  serialNumber: number
  totalAvailable: number
  purchasePrice: number
  purchaseAsset: string
} 