import axios from 'axios'
import type { ILeaderboardUser } from '../types/leaderboard'

interface ILeaderboardResponse {
  users: ILeaderboardUser[]
  total: number
  currentPage: number
  totalPages: number
  userPosition: number | null
}

export const leaderboardService = {
  async getLeaderboardAsync(_page = 1, _limit = 50): Promise<ILeaderboardResponse> {
    const { data } = await axios.get<ILeaderboardResponse>(
      `${import.meta.env.VITE_API_URL}/api/leaderboard`,
      {
        params: { page: _page, limit: _limit }
      }
    )
    return data
  }
} 