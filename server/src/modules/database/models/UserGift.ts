import { Schema, model } from 'mongoose'
import type { IGift } from './Gift'

export interface IUserGift {
  userId: number
  giftId: Schema.Types.ObjectId
  gift: IGift
  purchaseDate: Date
  status: 'purchased' | 'sent'
  recipientId?: number
  sentDate?: Date
}

const userGiftSchema = new Schema<IUserGift>({
  userId: { type: Number, required: true },
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  purchaseDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['purchased', 'sent'],
    default: 'purchased'
  },
  recipientId: { type: Number },
  sentDate: { type: Date }
}, {
  timestamps: true
})

// Индексы для быстрого поиска
userGiftSchema.index({ userId: 1 })
userGiftSchema.index({ giftId: 1 })
userGiftSchema.index({ status: 1 })

export const UserGift = model<IUserGift>('UserGift', userGiftSchema) 