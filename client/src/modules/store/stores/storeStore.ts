import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storeService } from '../services/storeService'
import type { IGift } from '../types/store'

export const useStoreStore = defineStore('store', () => {
  const gifts = ref<IGift[]>([])
  const selectedGift = ref<IGift | null>(null)

  const fetchGiftsAsync = async () => {
    try {
      gifts.value = await storeService.getGiftsAsync()
    } catch (error) {
      console.error('Ошибка загрузки подарков:', error)
      throw error
    }
  }

  const getGiftById = (id: string): IGift | undefined => {
    return gifts.value.find(gift => gift.id === id)
  }

  const fetchGiftByIdAsync = async (id: string) => {
    try {
      // Сначала ищем в кэше
      const cachedGift = getGiftById(id)
      if (cachedGift) {
        selectedGift.value = cachedGift
        return cachedGift
      }

      // Если нет в кэше, загружаем с сервера
      const gift = await storeService.getGiftByIdAsync(id)
      selectedGift.value = gift
      return gift
    } catch (error) {
      console.error('Ошибка загрузки подарка:', error)
      throw error
    }
  }

  return {
    gifts,
    selectedGift,
    fetchGiftsAsync,
    fetchGiftByIdAsync,
    getGiftById
  }
}) 