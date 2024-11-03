import type { IUser } from '@/shared/types/user'

export interface ILeaderboardUser {
  id: number
  name: string
  avatar?: string
  giftsCount: number
  giftsReceived: number
  giftsSent: number
  lastActive: Date
  position?: number
} 