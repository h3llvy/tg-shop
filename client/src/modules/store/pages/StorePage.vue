<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useStoreStore } from '../stores/storeStore'
import { GiftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const store = useStoreStore()
const { gifts } = storeToRefs(store)
const isLoading = ref(true)

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

const getAvailabilityText = (quantity: number, soldCount: number) => {
  const available = quantity - soldCount
  return `${available} of ${quantity}`
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
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="p-4">
      <div class="flex flex-col items-center justify-center mb-6">
        <GiftIcon class="w-12 h-12 text-blue-500 mb-2" />
        <h1 class="text-xl font-bold text-center text-gray-900 dark:text-white">
          Buy and Send Gifts
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
          Unique gifts for everyone by Crypto Pay
        </p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 h-48"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="relative rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
          :class="gift.bgColor"
          @click="navigateToGiftDetails(gift.id)"
        >
          <div class="flex flex-col items-center">
            <span class="text-4xl mb-2">{{ getGiftIcon(gift.category) }}</span>
            <h3 class="font-medium text-center mb-1">{{ gift.name }}</h3>
            <p class="text-xs text-gray-600 dark:text-gray-300">
              {{ getAvailabilityText(gift.quantity, gift.soldCount) }}
            </p>
            <div class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              {{ gift.price }} TON
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
