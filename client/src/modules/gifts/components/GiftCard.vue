<script setup lang="ts">
import { computed } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'

const props = defineProps<{
  gift: IUserGift
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const formatGiftsCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
</script>

<template>
  <div 
    class="w-[115px] h-[160px] rounded-xl relative p-2 cursor-pointer transition-colors duration-300 bg-bg-primary-light dark:bg-bg-secondary-dark"
    @click="emit('click')"
  >
    <!-- Номер подарка -->
    <div 
      class="absolute top-2 right-2 text-[12px] text-[#8E8E93] leading-[18px] tracking-[-0.08px] font-['SF_Pro_Text']"
    >
      {{ gift.serialNumber }} of {{ formatGiftsCount(gift.totalAvailable) }}
    </div>

    <!-- Иконка подарка -->
    <div class="flex justify-center items-center mt-6">
      <img 
        :src="getGiftIcon(gift.gift.name)"
        :alt="gift.gift.name"
        class="w-20 h-20 p-[3.333px] object-contain"
      />
    </div>

    <!-- Название подарка -->
    <div class="text-center mt-2">
      <h3 
        class="text-[14px] font-medium leading-[18px] tracking-[-0.442px] text-label-primary-light dark:text-label-primary-dark"
      >
        {{ gift.gift.name }}
      </h3>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'SF Pro Text';
  src: url('@/shared/assets/fonts/SF-Pro-Text-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
</style>