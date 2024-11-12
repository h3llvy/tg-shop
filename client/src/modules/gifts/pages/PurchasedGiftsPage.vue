<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { giftService } from '../services/giftService'
import GiftCard from '../components/GiftCard.vue'
import GiftDetailsModal from '../components/GiftDetailsModal.vue'

const gifts = ref<IUserGift[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedGift = ref<IUserGift | null>(null)

const loadPurchasedGiftsAsync = async () => {
  try {
    gifts.value = await giftService.getPurchasedGiftsAsync()
  } catch (err) {
    error.value = 'Не удалось загрузить подарки'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openGiftDetails = (gift: IUserGift) => {
  selectedGift.value = gift
}

onMounted(loadPurchasedGiftsAsync)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark p-4">
    <h1 class="text-2xl font-bold mb-6 text-label-primary-light dark:text-label-primary-dark">
      Мои подарки
    </h1>

    <div v-if="loading" class="grid grid-cols-3 gap-2">
      <div 
        v-for="i in 6" 
        :key="i"
        class="h-[160px] bg-separator-light dark:bg-separator-dark rounded-xl animate-pulse"
      />
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div 
      v-else-if="gifts.length" 
      class="grid grid-cols-3 gap-2"
    >
      <GiftCard
        v-for="gift in gifts"
        :key="gift._id"
        :gift="gift"
        @click="openGiftDetails(gift)"
      />
    </div>

    <div 
      v-else 
      class="text-center text-label-secondary-light dark:text-label-secondary-dark"
    >
      У вас пока нет купленных подарков
    </div>

    <GiftDetailsModal
      v-if="selectedGift"
      :gift="selectedGift"
      mode="send"
      @close="selectedGift = null"
    />
  </div>
</template> 