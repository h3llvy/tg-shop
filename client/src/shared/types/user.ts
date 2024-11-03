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

export interface IUserProfile extends IUser {
  firstName: string
  lastName?: string
  languageCode?: string
}