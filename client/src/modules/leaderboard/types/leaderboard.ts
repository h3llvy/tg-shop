import type { IUser } from '@/shared/types/user'

export interface ILeaderboardUser extends IUser {
  giftsCount: number
  position?: number
} 