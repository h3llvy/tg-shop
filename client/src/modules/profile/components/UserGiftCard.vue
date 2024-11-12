<script setup lang="ts">
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { ref } from 'vue'
import GiftDetailsModal from './GiftDetailsModal.vue'

const props = defineProps<{
  userGift: IUserGift
}>()

const showDetails = ref(false)

const handleClick = () => {
  showDetails.value = true
}
</script>

<template>
  <div 
    class="cursor-pointer rounded-xl bg-white relative p-4 overflow-hidden"
    @click="handleClick"
  >
    <!-- Фоновое изображение и контент как в StoreGiftCard -->
    <div class="relative z-10">
      <div class="text-right text-[13px] text-black/50">
        #{{ userGift.serialNumber }} of {{ userGift.totalAvailable }}
      </div>

      <div class="flex justify-center items-center">
        <img 
          :src="getGiftIcon(userGift.gift.name)"
          :alt="userGift.gift.name"
          class="w-32 h-32 p-[5.333px]"
        />
      </div>

      <div class="text-center">
        <h3 class="text-[17px] font-semibold">
          {{ userGift.gift.name }}
        </h3>
        
        <div class="mt-2 text-sm text-gray-500">
          {{ new Date(userGift.purchaseDate).toLocaleDateString() }}
        </div>
      </div>
    </div>

    <!-- Модальное окно с деталями -->
    <GiftDetailsModal
      v-if="showDetails"
      :user-gift="userGift"
      @close="showDetails = false"
    />
  </div>
</template> 