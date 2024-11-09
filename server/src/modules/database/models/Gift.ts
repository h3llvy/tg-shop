import { Schema, model } from 'mongoose'

export interface IGift {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
  quantity: number
  soldCount: number
  bgColor: string
}

const giftSchema = new Schema<IGift>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: String,
  category: { 
    type: String, 
    required: true,
    enum: ['stars', 'cakes', 'flowers', 'toys']
  },
  rarity: { 
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary']
  },
  isAvailable: { type: Boolean, default: true },
  quantity: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  bgColor: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Виртуальное поле для доступного количества
giftSchema.virtual('availableQuantity').get(function() {
  return this.quantity - this.soldCount
})

export const Gift = model<IGift>('Gift', giftSchema) 