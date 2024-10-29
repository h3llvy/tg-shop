export interface IGift {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  status: 'available' | 'purchased' | 'gifted'
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
