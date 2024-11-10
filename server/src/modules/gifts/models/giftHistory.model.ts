import mongoose, { Schema } from 'mongoose'

export enum GiftHistoryAction {
  PURCHASE = 'purchase',
  SEND = 'send'
}

const GiftHistorySchema = new Schema({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  userId: { type: Number, required: true },
  recipientId: { type: Number },
  action: { 
    type: String, 
    enum: Object.values(GiftHistoryAction),
    required: true 
  },
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('GiftHistory', GiftHistorySchema)
