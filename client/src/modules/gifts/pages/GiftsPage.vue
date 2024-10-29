<script setup lang="ts">
import { ref } from 'vue'
import GiftCard from '../components/GiftCard.vue'
import type { IGift } from '../types/gift'


const gifts = ref<IGift[]>(Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['Delicious Cake', 'Red Star', 'Green Star', 'Blue Star'][i % 4],
  description: 'A wonderful gift',
  price: i % 2 ? 5 : 10,
  imageUrl: `https://placehold.co/400x400/${
    ['pink', 'red', 'green', 'blue'][i % 4]
  }/white?text=Gift${i + 1}`,
  status: 'available' as const
})))

</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark overflow-auto">
    <!-- Заголовок и описание -->
    <div class="px-4 py-6 text-center">
      <h1 class="text-[32px] font-bold text-label-primary-light dark:text-label-primary-dark mb-2">
        Send Gifts in Telegram
      </h1>
      <p class="text-[16px] leading-[22px] text-label-secondary-light dark:text-label-secondary-dark max-w-[280px] mx-auto">
        Send gifts to users that can be stored in their app profile.
      </p>
    </div>

    <!-- Сетка подарков с возможностью скролла -->
    <div class="grid grid-cols-3 gap-4 px-4 pb-[80px] auto-rows-max">
      <GiftCard 
        v-for="gift in gifts" 
        :key="gift.id"
        :gift="gift"
      />
    </div>
  </div>
</template>
