import { Schema, model } from 'mongoose'
import { CryptoAsset } from '../../payment/types/payment'

interface IOrder {
  giftId: Schema.Types.ObjectId
  senderId: number // telegramId отправителя
  recipientId: number // telegramId получателя
  status: 'pending' | 'paid' | 'sent' | 'delivered' | 'cancelled'
  amount: number
  asset: CryptoAsset
  message?: string
  createdAt: Date
  updatedAt: Date
  paymentId?: string
}

const orderSchema = new Schema<IOrder>({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  senderId: { type: Number, required: true },
  recipientId: { type: Number, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'paid', 'sent', 'delivered', 'cancelled'],
    default: 'pending'
  },
  amount: { type: Number, required: true },
  asset: { type: String, required: true, enum: ['USDT', 'TON', 'BTC', 'ETH'] },
  message: String,
  paymentId: String
}, {
  timestamps: true
})

export const Order = model<IOrder>('Order', orderSchema) 