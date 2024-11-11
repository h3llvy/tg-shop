export interface IGift {
  _id: string
  name: string
  description: string
  image: string
  prices: {
    USDT: number
    TON: number
    BTC: number
    ETH: number
  }
  isAvailable: boolean
  availableQuantity: number
  soldCount: number
  status: 'available' | 'purchased' | 'gifted'
  category: string
  rarity: string
  bgColor: string
}

export interface IGiftPurchase {
  giftId: string
  userId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
}

export interface IGiftSend {
  giftId: string
  fromUserId: string
  toUserId: string
  message?: string
}

export interface IGiftAction {
  id: string
  type: 'purchase' | 'send'
  giftId: string
  userId: string
  targetUserId?: string
  timestamp: Date
}
