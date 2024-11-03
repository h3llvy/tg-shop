export interface IUser {
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
  giftsReceived: number
  giftsSent: number
  lastActive: Date
  createdAt: Date
  updatedAt: Date
} 