<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useStoreStore } from '../stores/storeStore'

const router = useRouter()
const store = useStoreStore()
const { gifts } = storeToRefs(store)
const isLoading = ref(true)

// Определяем основную валюту для каждого подарка
const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const getGiftIcon = (category: string) => {
  switch (category) {
    case 'cakes':
      return '🎂'
    case 'stars':
      return '⭐'
    default:
      return '🎁'
  }
}

const getAvailabilityText = (quantity: number, soldCount: number = 0) => {
  return `${soldCount} of ${quantity}`
}

const navigateToGiftDetails = (giftId: string) => {
  router.push(`/gift/${giftId}`)
}

onMounted(async () => {
  try {
    await store.fetchGiftsAsync()
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="px-4 py-6 text-center">
      <h1 class="text-[32px] font-bold text-label-primary-light dark:text-label-primary-dark mb-2">
        Buy and Send Gifts
      </h1>
      <p class="text-[16px] leading-[22px] text-label-secondary-light dark:text-label-secondary-dark max-w-[280px] mx-auto">
        Unique gifts for everyone by Crypto Pay.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner"></span>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 px-4 pb-[80px]">
      <div
        v-for="gift in gifts"
        :key="gift._id"
        class="relative rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
        :class="gift.bgColor"
        @click="navigateToGiftDetails(gift._id)"
      >
        <div class="flex flex-col items-center">
          <img :src="gift.image" :alt="gift.name" class="w-full rounded-lg mb-2">
          <h3 class="font-medium text-center mb-1">{{ gift.name }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300">
            {{ getAvailabilityText(gift.availableQuantity, gift.soldCount) }}
          </p>
          <div class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
            {{ gift.prices[assetMap[gift.name]] }} {{ assetMap[gift.name] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
