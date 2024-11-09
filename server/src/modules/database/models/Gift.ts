import { Schema, model } from 'mongoose'

interface IGift {
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
  createdAt: Date
  updatedAt: Date
}

const giftSchema = new Schema<IGift>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  prices: {
    USDT: { type: Number, required: true },
    TON: { type: Number, required: true },
    BTC: { type: Number, required: true },
    ETH: { type: Number, required: true }
  },
  isAvailable: { type: Boolean, default: true },
  availableQuantity: { type: Number, required: true },
}, {
  timestamps: true
})

export const Gift = model<IGift>('Gift', giftSchema) 