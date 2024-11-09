import { Schema, model } from 'mongoose'

interface ITransaction {
  orderId: Schema.Types.ObjectId
  invoiceId: number // ID инвойса от Crypto Bot
  amount: number
  asset: string // Криптовалюта (TON, BTC и т.д.)
  status: 'pending' | 'paid' | 'failed'
  paidAt?: Date
  payload?: string
  createdAt: Date
  updatedAt: Date
}

const transactionSchema = new Schema<ITransaction>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  invoiceId: { type: Number, required: true },
  amount: { type: Number, required: true },
  asset: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paidAt: Date,
  payload: String
}, {
  timestamps: true
})

export const Transaction = model<ITransaction>('Transaction', transactionSchema) 