import { Schema, model } from 'mongoose'

interface IGiftHistory {
  giftId: Schema.Types.ObjectId
  userId: number // telegramId пользователя
  action: 'view' | 'buy' | 'send'
  createdAt: Date
}

const giftHistorySchema = new Schema<IGiftHistory>({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  userId: { type: Number, required: true },
  action: { 
    type: String, 
    required: true,
    enum: ['view', 'buy', 'send']
  }
}, {
  timestamps: true
})

export const GiftHistory = model<IGiftHistory>('GiftHistory', giftHistorySchema) 