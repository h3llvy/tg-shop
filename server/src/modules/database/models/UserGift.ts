import { Schema, model } from 'mongoose'
import type { IGift } from './Gift'

export interface IUserGift {
  _id: Schema.Types.ObjectId
  userId: number
  giftId: Schema.Types.ObjectId
  gift: IGift
  purchaseDate: Date
  purchasePrice: number
  purchaseAsset: CryptoAsset
  serialNumber: number // Порядковый номер из доступных
  totalAvailable: number // Общее количество доступных на момент покупки
  status: 'purchased' | 'sent' | 'received'
  recipientId?: number
  sentDate?: Date
  receivedDate?: Date
  history: Array<{
    action: 'purchase' | 'send' | 'receive'
    fromUserId: number
    toUserId?: number
    date: Date
    price?: number
    asset?: CryptoAsset
  }>
  metadata: {
    purchaseInvoiceId: number
    transactionHash?: string
    originalPrice: number
    discount?: number
    giftMessage?: string
  }
}

const userGiftSchema = new Schema<IUserGift>({
  userId: { type: Number, required: true },
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  purchaseDate: { type: Date, default: Date.now },
  purchasePrice: { type: Number, required: true },
  purchaseAsset: { 
    type: String, 
    enum: ['USDT', 'TON', 'BTC', 'ETH'],
    required: true 
  },
  serialNumber: { type: Number, required: true },
  totalAvailable: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['purchased', 'sent', 'received'],
    default: 'purchased'
  },
  recipientId: { type: Number },
  sentDate: { type: Date },
  receivedDate: { type: Date },
  history: [{
    action: { 
      type: String, 
      enum: ['purchase', 'send', 'receive'],
      required: true 
    },
    fromUserId: { type: Number, required: true },
    toUserId: { type: Number },
    date: { type: Date, default: Date.now },
    price: { type: Number },
    asset: { type: String }
  }],
  metadata: {
    purchaseInvoiceId: { type: Number, required: true },
    transactionHash: { type: String },
    originalPrice: { type: Number, required: true },
    discount: { type: Number },
    giftMessage: { type: String }
  }
}, {
  timestamps: true
})

// Индексы для быстрого поиска
userGiftSchema.index({ userId: 1 })
userGiftSchema.index({ giftId: 1 })
userGiftSchema.index({ status: 1 })

export const UserGift = model<IUserGift>('UserGift', userGiftSchema) 