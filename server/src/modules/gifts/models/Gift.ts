import { Schema, model } from 'mongoose'
import type { IGift } from '../types/gift'

const giftSchema = new Schema<IGift>({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['available', 'purchased', 'gifted'],
    default: 'available'
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  recipient: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
})

export const GiftModel = model<IGift>('Gift', giftSchema)
