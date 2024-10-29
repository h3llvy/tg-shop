<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GiftIcon } from '@heroicons/vue/24/outline'
import type { IStoreGift } from '../types/store'

const router = useRouter()

const gifts = ref<IStoreGift[]>([
  {
    id: '1',
    name: 'Delicious Cake',
    description: 'A tasty cake for your friend',
    price: 10,
    available: 100,
    bgColor: 'bg-accent-purple-light dark:bg-accent-purple-dark'
  },
  {
    id: '2',
    name: 'Green Star',
    description: '',
    price: 5,
    available: 802,
    bgColor: 'bg-[#E8F5E9]'
  },
  {
    id: '3',
    name: 'Blue Star',
    description: '',
    price: 5,
    available: 458,
    bgColor: 'bg-[#E3F2FD]'
  },
  {
    id: '4',
    name: 'Red Star',
    description: '',
    price: 5,
    available: 10000,
    bgColor: 'bg-[#FCE4EC]'
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
