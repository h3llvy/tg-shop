import { Schema, model } from 'mongoose'

export enum GiftHistoryAction {
  PURCHASE = 'purchase',
  SEND = 'send'
}

export interface IGiftHistory {
  giftId: Schema.Types.ObjectId
  userId: number
  action: GiftHistoryAction
  recipientId?: number
  timestamp: Date
}

const giftHistorySchema = new Schema<IGiftHistory>({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  userId: { type: Number, required: true },
  action: { 
    type: String, 
    required: true,
    enum: Object.values(GiftHistoryAction)
  },
  recipientId: { type: Number },
  timestamp: { type: Date, default: Date.now }
})

giftHistorySchema.index({ giftId: 1 })
giftHistorySchema.index({ userId: 1 })
giftHistorySchema.index({ timestamp: -1 })

export const GiftHistory = model<IGiftHistory>('GiftHistory', giftHistorySchema)