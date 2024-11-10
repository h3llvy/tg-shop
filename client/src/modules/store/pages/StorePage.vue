<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { giftService } from '@/modules/gifts/services/giftService'
import type { IGift } from '@/modules/gifts/types/gift'
import GiftIcon from '@/modules/store/assets/icons/gift-icon.svg'
import StoreGiftCard from '../components/StoreGiftCard.vue'
import StoreSkeleton from '../components/StoreSkeleton.vue'

const router = useRouter()
const gifts = ref<IGift[]>([])
const loading = ref(true)
const isComponentReady = ref(false)

onMounted(async () => {
  try {
    // Загружаем данные
    gifts.value = await giftService.getAllGiftsAsync()
    
    // После загрузки данных ждем следующего кадра анимации
    requestAnimationFrame(() => {
      isComponentReady.value = true
    })
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
  } finally {
    loading.value = false
  }
})

const handleGiftClick = (giftId: string) => {
  router.push({ 
    name: 'gift-details', 
    params: { id: giftId.toString() }
  })
}
</script>

<template>
  <StoreSkeleton v-if="loading || !isComponentReady" />
  
  <div v-else class="min-h-screen bg-white p-6">
    <div class="flex flex-col items-center mb-8">
      <img :src="GiftIcon" alt="Gift" class="w-11 h-12 mb-6" />
      
      <h1 class="text-2xl font-semibold text-black mb-2 text-center tracking-[-0.43px] leading-8">
        Buy and Send Gifts
      </h1>
      
      <p class="text-[17px] text-[#8E8E93] text-center leading-[22px] tracking-[-0.43px] max-w-[329px]">
        Unique gifts for everyone by Crypto Pay
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 px-0 py-4">
      <StoreGiftCard 
        v-for="gift in gifts"
        :key="gift._id"
        :gift="gift"
        @click="handleGiftClick(gift._id)"
      />
    </div>
  </div>
</template>