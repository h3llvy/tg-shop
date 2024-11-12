<script setup lang="ts">
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { useUserAvatars } from '@/shared/composables/useUserAvatars'

const props = defineProps<{
  gift: IUserGift
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { getUserAvatar, getUserInitials, getAvatarBackgroundColor } = useUserAvatars()

const formatGiftsCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
</script>

<template>
  <div 
    class="w-[115px] h-[160px] rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark relative p-2 cursor-pointer"
    @click="emit('click')"
  >
    <!-- Аватар отправителя -->
    <div class="absolute top-2 left-2 w-4 h-4 rounded-full overflow-hidden">
      <img 
        v-if="getUserAvatar(gift.userId)"
        :src="getUserAvatar(gift.userId)"
        :alt="gift.fromUserName"
        class="w-full h-full object-cover"
      />
      <div 
        v-else
        class="w-full h-full flex items-center justify-center text-[8px] text-white"
        :style="{ backgroundColor: getAvatarBackgroundColor(gift.userId) }"
      >
        {{ getUserInitials(gift.fromUserName || '') }}
      </div>
    </div>

    <!-- Номер подарка -->
    <div class="absolute top-2 right-2 text-[10px] text-[#8E8E93]">
      {{ gift.serialNumber }} of {{ formatGiftsCount(gift.totalAvailable) }}
    </div>

    <!-- Иконка подарка -->
    <div class="flex justify-center items-center h-20 mt-6">
      <img 
        :src="getGiftIcon(gift.gift.name)"
        :alt="gift.gift.name"
        class="w-20 h-20 object-contain"
      />
    </div>

    <!-- Название подарка -->
    <div class="text-center mt-5">
      <h3 class="text-sm font-medium tracking-[-0.442px] text-label-primary-light dark:text-label-primary-dark">
        {{ gift.gift.name }}
      </h3>
    </div>
  </div>
</template> 