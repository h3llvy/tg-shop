<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { 
  ShoppingBagIcon, 
  GiftIcon, 
  GlobeAltIcon,
  UserIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const isActive = (routeName: string) => route.name === routeName

const handleNavClick = (routeName: string) => {
  // Тактильный отклик при навигации
  hapticFeedback.impactOccurred('light')
  router.push({ name: routeName })
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 h-[49px] bg-[rgba(241,241,242,0.75)] dark:bg-[rgba(30,30,30,0.75)] backdrop-blur-[50px] border-t border-gray-200 dark:border-gray-800">
    <div class="flex justify-around h-full items-center">
      <button 
        @click="handleNavClick('store')"
        class="flex flex-col items-center gap-0.5 px-6 active:scale-95 transition-transform"
      >
        <ShoppingBagIcon 
          class="w-6 h-6 transition-colors"
          :class="isActive('store') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        />
        <span 
          class="text-[10px] tracking-[-0.2px] transition-colors"
          :class="isActive('store') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        >
          Store
        </span>
      </button>

      <button 
        @click="handleNavClick('gifts')"
        class="flex flex-col items-center gap-0.5 px-6 active:scale-95 transition-transform"
      >
        <GiftIcon 
          class="w-6 h-6 transition-colors"
          :class="isActive('gifts') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        />
        <span 
          class="text-[10px] tracking-[-0.2px] transition-colors"
          :class="isActive('gifts') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        >
          Gifts
        </span>
      </button>

      <button 
        @click="handleNavClick('leaderboard')"
        class="flex flex-col items-center gap-0.5 px-6 active:scale-95 transition-transform"
      >
        <GlobeAltIcon 
          class="w-6 h-6 transition-colors"
          :class="isActive('leaderboard') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        />
        <span 
          class="text-[10px] tracking-[-0.2px] transition-colors"
          :class="isActive('leaderboard') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        >
          Leaderboard
        </span>
      </button>

      <button 
        @click="handleNavClick('profile')"
        class="flex flex-col items-center gap-0.5 px-6 active:scale-95 transition-transform"
      >
        <UserIcon 
          class="w-6 h-6 transition-colors"
          :class="isActive('profile') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        />
        <span 
          class="text-[10px] tracking-[-0.2px] transition-colors"
          :class="isActive('profile') ? 'text-[#0066FF]' : 'text-[#8E8E93]'"
        >
          Profile
        </span>
      </button>
    </div>
  </nav>
</template>
