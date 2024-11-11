import { Schema, model } from 'mongoose'

interface ISentGift {
  giftId: Schema.Types.ObjectId
  senderId: number
  recipientId: number
  status: 'sent' | 'received'
  sentAt: Date
  receivedAt?: Date
}

const sentGiftSchema = new Schema<ISentGift>({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  senderId: { type: Number, required: true },
  recipientId: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['sent', 'received'],
    default: 'sent'
  },
  sentAt: { type: Date, default: Date.now },
  receivedAt: { type: Date }
})

export const SentGift = model<ISentGift>('SentGift', sentGiftSchema) 