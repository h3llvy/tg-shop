export interface ITransaction {
  id: string
  type: 'purchase' | 'gift'
  status: 'pending' | 'completed' | 'failed'
  amount: number
  giftId: string
  fromUserId: number
  toUserId?: number
  createdAt: Date
} 