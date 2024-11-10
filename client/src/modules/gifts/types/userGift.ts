import type { IGift } from './gift'

export interface IUserGift {
  _id: string
  userId: number
  gift: IGift
  purchaseDate: Date
  status: 'purchased' | 'sent'
  recipientId?: number
  sentDate?: Date
} 