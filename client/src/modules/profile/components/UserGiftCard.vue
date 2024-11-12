<script setup lang="ts">
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { ref, computed } from 'vue'
import GiftDetailsModal from './GiftDetailsModal.vue'

const props = defineProps<{
  userGift: IUserGift
}>()

const showDetails = ref(false)

const giftName = computed(() => props.userGift?.gift?.name ?? 'Неизвестный подарок')
const serialNumber = computed(() => props.userGift?.serialNumber ?? '?')
const totalAvailable = computed(() => props.userGift?.totalAvailable ?? '?')
const purchaseDate = computed(() => {
  return props.userGift?.purchaseDate 
    ? new Date(props.userGift.purchaseDate).toLocaleDateString()
    : 'Дата неизвестна'
})

const handleClick = () => {
  showDetails.value = true
}
</script>

<template>
  <div 
    class="cursor-pointer rounded-xl bg-white relative p-4 overflow-hidden"
    @click="handleClick"
  >
    <div class="relative z-10">
      <div class="text-right text-[13px] text-black/50">
        #{{ serialNumber }} of {{ totalAvailable }}
      </div>

      <div class="flex justify-center items-center">
        <img 
          v-if="userGift?.gift"
          :src="getGiftIcon(userGift.gift.name)"
          :alt="giftName"
          class="w-32 h-32 p-[5.333px]"
        />
        <div 
          v-else 
          class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center"
        >
          ?
        </div>
      </div>

      <div class="text-center">
        <h3 class="text-[17px] font-semibold">
          {{ giftName }}
        </h3>
        
        <div class="mt-2 text-sm text-gray-500">
          {{ purchaseDate }}
        </div>
      </div>
    </div>

    <!-- Модальное окно с деталями -->
    <GiftDetailsModal
      v-if="showDetails && userGift"
      :user-gift="userGift"
      @close="showDetails = false"
    />
  </div>
</template> 