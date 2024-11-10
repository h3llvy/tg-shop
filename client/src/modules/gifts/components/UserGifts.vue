<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { giftService } from '../services/giftService'
import type { IUserGift } from '../types/gift'

const gifts = ref<IUserGift[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    gifts.value = await giftService.getUserGiftsAsync()
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="px-4 py-6 text-center">
      <h1 class="text-[32px] font-bold text-label-primary-light dark:text-label-primary-dark mb-2">
        My Gifts
      </h1>
      <p class="text-[16px] leading-[22px] text-label-secondary-light dark:text-label-secondary-dark max-w-[280px] mx-auto">
        Your purchased gifts that can be sent to other users.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner"></span>
    </div>

    <div v-else-if="gifts.length === 0" class="text-center py-8">
      <p class="text-label-secondary-light dark:text-label-secondary-dark">
        You haven't purchased any gifts yet
      </p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 px-4 pb-[80px]">
      <div 
        v-for="userGift in gifts" 
        :key="`${userGift.giftId}-${userGift.purchaseDate}`"
        class="block rounded-xl p-4 transition-transform hover:scale-105"
        :class="userGift.gift.bgColor"
      >
        <div class="relative">
          <img :src="userGift.gift.image" :alt="userGift.gift.name" class="w-full rounded-lg mb-2">
          <span class="absolute top-2 right-2 text-xs bg-white/80 rounded px-2 py-1">
            {{ userGift.status }}
          </span>
        </div>
        
        <h3 class="font-medium text-sm mb-1">{{ userGift.gift.name }}</h3>
        
        <div class="flex items-center justify-between">
          <span class="text-xs text-label-secondary-light dark:text-label-secondary-dark">
            {{ new Date(userGift.purchaseDate).toLocaleDateString() }}
          </span>
          <button 
            v-if="userGift.status === 'purchased'"
            class="btn btn-sm btn-primary"
            @click="$emit('send', userGift)"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 