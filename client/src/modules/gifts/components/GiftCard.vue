<script setup lang="ts">
import type { IGift } from '../types/gift'
import { getGiftIcon } from '@/shared/utils/giftIcons'

const props = defineProps<{
  gift: IGift
}>()

// Определяем основную валюту для каждого подарка
const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const primaryAsset = assetMap[props.gift.name as keyof typeof assetMap] || 'USDT'

const getAvailabilityText = (availableQuantity: number, soldCount: number, total: number) => {
  const remaining = availableQuantity
  return `${remaining} of ${total}`
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <div class="flex flex-col items-center">
      <img 
        :src="getGiftIcon(gift.name)"
        :alt="gift.name"
        class="w-16 h-16 mb-2"
      />
      <h3 class="text-sm font-medium text-gray-900 dark:text-white">
        {{ gift.name }}
      </h3>
      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ gift.prices[primaryAsset] }} {{ primaryAsset }}
      </div>
    </div>
  </div>
</template>
