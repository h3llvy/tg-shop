<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { profileService } from '../services/profileService'
import UserGiftCard from './UserGiftCard.vue'

const gifts = ref<IUserGift[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadGiftsHistoryAsync = async () => {
  try {
    const response = await profileService.getGiftsHistoryAsync()
    // Проверяем что каждый подарок имеет необходимые поля
    gifts.value = response.filter(gift => gift && gift.gift && gift._id)
  } catch (err) {
    error.value = 'Не удалось загрузить историю подарков'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const sortedGifts = computed(() => {
  return gifts.value
    .filter(gift => gift && gift.gift && gift._id)
    .sort((a, b) => {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    })
})

onMounted(loadGiftsHistoryAsync)
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4 text-label-primary-light dark:text-label-primary-dark">
      История подарков
    </h2>

    <div v-if="loading" class="space-y-4">
      <div 
        v-for="i in 3" 
        :key="i"
        class="h-48 bg-separator-light dark:bg-separator-dark rounded-xl animate-pulse"
      />
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div 
      v-else-if="gifts.length" 
      class="grid grid-cols-2 gap-4"
    >
      <UserGiftCard
        v-for="gift in sortedGifts"
        :key="gift._id"
        :user-gift="gift"
      />
    </div>

    <div 
      v-else 
      class="text-center text-label-secondary-light dark:text-label-secondary-dark"
    >
      У вас пока нет подарков
    </div>
  </div>
</template> 