import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IGift } from '../types/gift'
import { giftService } from '../services/giftService'

export const useGiftStore = defineStore('gift', () => {
  const gifts = ref<IGift[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGifts() {
    loading.value = true
    try {
      gifts.value = await giftService.getGifts()
    } catch (err) {
      error.value = 'Failed to fetch gifts'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    gifts,
    loading,
    error,
    fetchGifts
  }
})
