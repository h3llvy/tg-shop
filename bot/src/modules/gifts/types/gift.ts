export interface IGift {
  id: number
  name: string
  description: string
  price: number
  image: string
  createdAt: Date
  updatedAt: Date
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
