import type { IUser } from '@/shared/types/user'

export type CryptoAsset = 'USDT' | 'TON' | 'BTC' | 'ETH'

export interface IGift {
  _id: string
  name: string
  description: string
  image: string
  prices: {
    [key in CryptoAsset]: number
  }
  category: string
  rarity: string
  availableQuantity: number
  soldCount: number
  isAvailable: boolean
  bgColor: string
}

export interface IGiftHistory {
  id: string
  from: IUser
  to?: IUser
  gift: IGift
  date: string
  status: 'sent' | 'received'
} 