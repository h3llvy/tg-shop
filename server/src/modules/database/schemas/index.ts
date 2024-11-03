import { Schema, model } from 'mongoose'

// Пользователь
const userSchema = new Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  languageCode: String,
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

// Подарок
const giftSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

// Транзакция
const transactionSchema = new Schema({
  userId: { type: Number, required: true },
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
})

// Отправленный подарок
const sentGiftSchema = new Schema({
  giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
  senderId: { type: Number, required: true },
  recipientId: { type: Number, required: true },
  message: String,
  status: {
    type: String,
    enum: ['sent', 'received', 'expired'],
    default: 'sent'
  },
  sentAt: { type: Date, default: Date.now },
  expiresAt: Date
})

export const User = model('User', userSchema)
export const Gift = model('Gift', giftSchema)
export const Transaction = model('Transaction', transactionSchema)
export const SentGift = model('SentGift', sentGiftSchema) 