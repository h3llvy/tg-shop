<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GiftIcon } from '@heroicons/vue/24/outline'
import type { IGift } from '../types/gift'

interface IStoreGift extends IGift {
  bgColor: string
}

const router = useRouter()

const gifts = ref<IStoreGift[]>([
  {
    id: '1',
    name: 'Вкусный торт',
    price: 10,
    description: '',
    status: 'available',
    bgColor: 'bg-[#FFF3E0]',
    available: '3 of 500'
  },
  {
    id: '2',
    name: 'Зеленая звезда',
    price: 5,
    description: '',
    status: 'available',
    bgColor: 'bg-[#E8F5E9]',
    available: '802 of 3K'
  },
  {
    id: '3',
    name: 'Синяя звезда',
    price: 5,
    description: '',
    status: 'available',
    bgColor: 'bg-[#E3F2FD]',
    available: '458 of 5K'
  },
  {
    id: '4',
    name: 'Красная звезда',
    price: 5,
    description: '',
    status: 'available',
    bgColor: 'bg-[#FCE4EC]',
    available: '10K of 10K'
  }
])

const navigateToGiftDetails = (_giftId: string): void => {
  router.push(`/gift/${_giftId}`)
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-center mb-4">
      <GiftIcon class="w-12 h-12 text-primary-light dark:text-primary-dark mr-2" />
      <h1 class="text-2xl font-bold text-label-primary-light dark:text-label-primary-dark">
        Купить и отправить подарки
      </h1>
    </div>
    
    <p class="text-label-secondary-light dark:text-label-secondary-dark text-center mb-8">
      Уникальные подарки для каждого от Crypto Pay
    </p>

    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="gift in gifts" 
        :key="gift.id"
        :class="['rounded-lg p-4 cursor-pointer transition-transform hover:scale-105', gift.bgColor]"
        @click="navigateToGiftDetails(gift.id)"
      >
        <div class="w-full aspect-square flex items-center justify-center rounded-lg mb-2">
          <GiftIcon class="w-16 h-16 text-primary-light dark:text-primary-dark" />
        </div>
        <h3 class="font-bold text-label-primary-light dark:text-label-primary-dark">
          {{ gift.name }}
        </h3>
        <p class="text-xs text-label-secondary-light dark:text-label-secondary-dark">
          {{ gift.available }}
        </p>
        <p class="mt-2 font-bold text-accent-primary">
          {{ gift.price }} TON
        </p>
      </div>
    </div>
  </div>
</template>
