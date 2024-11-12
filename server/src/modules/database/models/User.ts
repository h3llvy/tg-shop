import mongoose, { Schema, model } from 'mongoose'
import type { IUser } from '../types/user'

const userSchema = new Schema<IUser>({
  telegramId: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: String,
  username: String,
  languageCode: String,
  isPremium: {
    type: Boolean,
    default: false
  },
  giftsReceived: {
    type: Number,
    default: 0
  },
  giftsSent: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  avatar: {
    fileId: String,
    url: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  collection: 'users'
})

// Добавляем виртуальное поле для общего количества подарков
userSchema.virtual('giftsCount').get(function() {
  return this.giftsReceived + this.giftsSent
})

// Добавим виртуальное поле для проверки актуальности аватара
userSchema.virtual('isAvatarOutdated').get(function() {
  if (!this.avatar?.lastUpdated) return true
  
  const lastUpdate = new Date(this.avatar.lastUpdated).getTime()
  const now = new Date().getTime()
  const dayInMs = 24 * 60 * 60 * 1000
  
  return now - lastUpdate > dayInMs
})

// Обязательно включаем виртуальные поля при использовании lean()
userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

export const User = model<IUser>('User', userSchema) 