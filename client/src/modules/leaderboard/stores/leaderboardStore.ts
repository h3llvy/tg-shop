import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ILeaderboardUser } from '../types/leaderboard'
import { leaderboardService } from '../services/leaderboardService'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const users = ref<ILeaderboardUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const userPosition = ref<number | null>(null)

  async function fetchLeaderboardAsync(_page?: number) {
    loading.value = true
    try {
      const response = await leaderboardService.getLeaderboardAsync(_page)
      users.value = response.users
      currentPage.value = response.currentPage
      totalPages.value = response.totalPages
      userPosition.value = response.userPosition
    } catch (err) {
      error.value = 'Не удалось загрузить лидерборд'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    userPosition,
    fetchLeaderboardAsync
  }
}) 