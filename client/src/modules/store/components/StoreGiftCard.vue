<script setup lang="ts">
import type { IGift } from '@/modules/gifts/types/gift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import EthIcon from '@/modules/store/assets/icons/ETH.svg'
import TonIcon from '@/modules/store/assets/icons/TON.svg'
import UsdtIcon from '@/modules/store/assets/icons/USDT.svg'
import { CurrencyDollarIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  gift: IGift
}>()

const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const getCryptoIcon = (giftName: string): any => {
  const icons = {
    'Delicious Cake': UsdtIcon,
    'Red Star': TonIcon,
    'Green Star': CurrencyDollarIcon,
    'Blue Star': EthIcon
  }
  return icons[giftName] || UsdtIcon
}

const getBackgroundClass = (giftName: string) => {
  const backgrounds = {
    'Delicious Cake': 'bg-gradient-to-b from-[rgba(254,159,65,0.20)] to-[rgba(254,159,65,0.10)]',
    'Green Star': 'bg-gradient-to-b from-[rgba(70,209,0,0.20)] to-[rgba(70,209,0,0.06)]',
    'Blue Star': 'bg-gradient-to-b from-[rgba(0,122,255,0.20)] to-[rgba(0,122,255,0.05)]',
    'Red Star': 'bg-gradient-to-b from-[rgba(255,71,71,0.20)] to-[rgba(255,71,71,0.05)]'
  }
  return backgrounds[giftName] || ''
}

const getPrimaryAsset = (giftName: string) => {
  return assetMap[giftName as keyof typeof assetMap] || 'USDT'
}
</script>

<template>
  <div 
    class="cursor-pointer  rounded-xl bg-white relative p-4"
    :class="getBackgroundClass(gift.name)"
  >
    <div class="text-right text-[13px] text-black/50 leading-[18px] tracking-[-0.08px]">
      {{ gift.soldCount }} of {{ gift.availableQuantity + gift.soldCount }}
    </div>

    <div class="flex justify-center items-center my-8">
      <img 
        :src="getGiftIcon(gift.name)"
        :alt="gift.name"
        class="w-32 h-32 p-[5.333px]"
      />
    </div>

    <div class="text-center">
      <h3 class="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.43px] mb-3">
        {{ gift.name }}
      </h3>
      
      <div class="inline-flex h-[30px] px-4 py-1.5 bg-[#007AFF] rounded-full items-center justify-center">
        <img 
          v-if="typeof getCryptoIcon(gift.name) === 'string'"
          :src="getCryptoIcon(gift.name)"
          class="w-6 h-6 mr-2"
        />
        <component 
          v-else
          :is="getCryptoIcon(gift.name)"
          class="w-6 h-6 mr-2"
        />
        <span class="text-sm font-medium text-white">
          {{ gift.prices[getPrimaryAsset(gift.name)] }} {{ getPrimaryAsset(gift.name) }}
        </span>
      </div>
    </div>
  </div>
</template>