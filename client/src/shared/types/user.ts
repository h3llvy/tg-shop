export interface IUser {
  id: number // telegramId
  name: string
  username?: string
  avatar?: string
  isPremium?: boolean
  giftsReceived: number
  giftsSent: number
  lastActive: Date
}

export interface IUserProfile {
  id: number
  firstName: string
  lastName?: string
  username?: string
  isPremium?: boolean
  giftsReceived: number
  giftsSent: number
  avatar?: string
  languageCode?: string
}