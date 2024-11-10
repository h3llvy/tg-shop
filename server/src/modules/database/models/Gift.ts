import { Schema, model } from 'mongoose'
import type { CryptoAsset } from '../../payment/types/payment'

export interface IGift {
  name: string
  description: string
  image: string
  prices: {
    [key in CryptoAsset]: number
  }
  isAvailable: boolean
  availableQuantity: number
  soldCount: number
  status: 'available' | 'purchased' | 'gifted'
  rarity: string
  category: string
  owner?: Schema.Types.ObjectId
  recipient?: Schema.Types.ObjectId
  bgColor: string
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
  soldCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['available', 'purchased', 'gifted'],
    default: 'available'
  },
  rarity: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  bgColor: { type: String, required: true }
}, {
  timestamps: true
})

export const Gift = model<IGift>('Gift', giftSchema) 