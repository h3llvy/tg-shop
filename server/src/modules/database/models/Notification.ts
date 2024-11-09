import { Schema, model } from 'mongoose'

interface INotification {
  userId: number // telegramId пользователя
  type: 'gift_received' | 'gift_sent' | 'payment_success' | 'payment_failed'
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['gift_received', 'gift_sent', 'payment_success', 'payment_failed']
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed },
}, {
  timestamps: true
})

export const Notification = model<INotification>('Notification', notificationSchema) 