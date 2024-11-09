<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { IGift } from '../types/gift'
import { giftService } from '../services/giftService'
import GiftCard from '../components/GiftCard.vue'

const gifts = ref<IGift[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    gifts.value = await giftService.getAllGiftsAsync()
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark overflow-auto">
    <div class="px-4 py-6 text-center">
      <h1 class="text-[32px] font-bold text-label-primary-light dark:text-label-primary-dark mb-2">
        Send Gifts in Telegram
      </h1>
      <p class="text-[16px] leading-[22px] text-label-secondary-light dark:text-label-secondary-dark max-w-[280px] mx-auto">
        Send gifts to users that can be stored in their app profile.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner"></span>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 px-4 pb-[80px]">
      <GiftCard 
        v-for="gift in gifts" 
        :key="gift.id"
        :gift="gift"
      />
    </div>
  </div>
</template>
