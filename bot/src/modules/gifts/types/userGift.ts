import type { IGift } from './gift'

export interface IUserGift {
  _id: string
  userId: number
  gift: IGift
  purchaseDate: Date
  status: 'purchased' | 'sent' | 'received'
  recipientId?: number
  sentDate?: Date
  receivedDate?: Date
  purchasePrice: number
  purchaseAsset: string
  serialNumber: number
  totalAvailable: number
  history: Array<{
    action: 'purchase' | 'send' | 'receive'
    fromUserId: number
    toUserId?: number
    date: Date
    price?: number
    asset?: string
  }>
  metadata: {
    purchaseInvoiceId: number
    transactionHash?: string
    originalPrice: number
    discount?: number
    giftMessage?: string
  }
} 