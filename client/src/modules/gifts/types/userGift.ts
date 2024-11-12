import type { CryptoAsset } from '@/shared/types/payment'

export interface IGift {
  _id: string
  name: string
  description: string
  image: string
  prices: Record<CryptoAsset, number>
  isAvailable: boolean
  availableQuantity: number
  soldCount: number
  status: 'available' | 'purchased' | 'gifted'
  rarity: string
  category: string
  bgColor: string
}

export interface IUserGift {
  _id: string
  userId: number
  giftId: string
  gift: IGift
  purchaseDate: string
  purchasePrice: number
  purchaseAsset: CryptoAsset
  serialNumber: number
  totalAvailable: number
  status: 'purchased' | 'sent' | 'received'
  recipientId?: number
  sentDate?: string
  receivedDate?: string
  history: Array<{
    action: 'purchase' | 'send' | 'receive'
    fromUserId: number
    toUserId?: number
    date: string
    price?: number
    asset?: CryptoAsset
  }>
  fromUserName?: string
  fromUserAvatar?: string
} 