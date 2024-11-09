import type { Types } from 'mongoose'

export interface IGift {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isAvailable: boolean
  quantity: number
  soldCount: number
  bgColor: string
  availableQuantity?: number
  createdAt: Date
  updatedAt: Date
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