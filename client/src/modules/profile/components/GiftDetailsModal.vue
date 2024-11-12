<script setup lang="ts">
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'

const props = defineProps<{
  userGift: IUserGift
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="emit('close')"
  />
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 z-50">
    <div class="flex items-center gap-4 mb-4">
      <img 
        :src="getGiftIcon(userGift.gift.name)"
        :alt="userGift.gift.name"
        class="w-16 h-16"
      />
      <div>
        <h3 class="font-medium">{{ userGift.gift.name }}</h3>
        <p class="text-sm text-gray-500">
          #{{ userGift.serialNumber }} of {{ userGift.totalAvailable }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-medium text-gray-500">Purchase Details</h4>
        <p>{{ userGift.purchasePrice }} {{ userGift.purchaseAsset }}</p>
        <p>{{ new Date(userGift.purchaseDate).toLocaleString() }}</p>
      </div>

      <div v-if="userGift.history.length > 1">
        <h4 class="text-sm font-medium text-gray-500">History</h4>
        <div 
          v-for="(event, index) in userGift.history" 
          :key="index"
          class="text-sm"
        >
          {{ event.action }} - {{ new Date(event.date).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template> 