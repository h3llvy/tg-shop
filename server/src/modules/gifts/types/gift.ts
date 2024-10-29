import type { Types } from 'mongoose'

export interface IGift {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  status: 'available' | 'purchased' | 'gifted'
  owner?: Types.ObjectId
  recipient?: Types.ObjectId
}

export interface IGiftPurchase {
  giftId: string
  userId: string
}

export interface IGiftSend {
  giftId: string
  userId: string
  recipientId: string
} 