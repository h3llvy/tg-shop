import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IGift } from '../../gifts/types/gift'
import { giftService } from '../../gifts/services/giftService'

export const useStoreStore = defineStore('store', () => {
  const gifts = ref<IGift[]>([])

  const fetchGiftsAsync = async () => {
    try {
      gifts.value = await giftService.getAllGiftsAsync()
    } catch (error) {
      console.error('Ошибка получения подарков:', error)
      throw error
    }
  }

  const getGiftById = (id: string) => {
    return gifts.value.find(gift => gift._id === id)
  }

  const fetchGiftByIdAsync = async (id: string) => {
    return await giftService.getGiftByIdAsync(id)
  }

  return {
    gifts,
    fetchGiftsAsync,
    getGiftById,
    fetchGiftByIdAsync
  }
}) 