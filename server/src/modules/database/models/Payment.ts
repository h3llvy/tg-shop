import { Schema, model } from 'mongoose'

interface IPayment {
  orderId: Schema.Types.ObjectId
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  cryptoPayId: string
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  cryptoPayId: { type: String, required: true }
}, {
  timestamps: true
})

export const Payment = model<IPayment>('Payment', paymentSchema) 