import { Schema, model } from 'mongoose'

export interface ILeaderboardUser {
  telegramId: number
  name: string
  username?: string
  avatar?: string
  giftsCount: number
  giftsReceived: number
  giftsSent: number
  lastActive: Date
  position?: number
}

const leaderboardSchema = new Schema<ILeaderboardUser>({
  telegramId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  username: String,
  avatar: String,
  giftsCount: { type: Number, default: 0 },
  giftsReceived: { type: Number, default: 0 },
  giftsSent: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
})

export const Leaderboard = model<ILeaderboardUser>('Leaderboard', leaderboardSchema) 