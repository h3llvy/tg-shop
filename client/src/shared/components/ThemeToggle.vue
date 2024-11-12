<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/shared/composables/useTheme'
import SunIcon from '@/shared/components/icons/SunIcon.vue'
import MoonIcon from '@/shared/components/icons/MoonIcon.vue'

const { isDarkTheme, toggleTheme } = useTheme()
const isAnimating = ref(false)

const handleToggle = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  toggleTheme()
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<template>
  <div 
    class="flex h-8 p-0.5 items-center rounded-[99px] transition-colors duration-300 relative cursor-pointer"
    :class="isDarkTheme ? 'bg-black' : 'bg-[#EFEFF3]'"
    @click="handleToggle"
  >
    <!-- Подвижная кнопка -->
    <div
      class="absolute w-[34px] h-[28px] rounded-[99px] transition-all duration-300 ease-in-out border-[0.5px] border-black/[0.04]"
      :class="[
        isDarkTheme 
          ? 'translate-x-[34px] bg-[#2C2C2E] shadow-[0px_3px_8px_0px_rgba(0,0,0,0.12),0px_3px_1px_0px_rgba(0,0,0,0.04)]' 
          : 'translate-x-0 bg-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.12),0px_3px_1px_0px_rgba(0,0,0,0.04)]'
      ]"
    />

    <!-- Иконки -->
    <div class="flex w-[68px] relative">
      <!-- Солнце -->
      <div 
        class="flex w-[34px] h-7 items-center justify-center z-10"
      >
        <SunIcon 
          class="w-4 h-4 transition-all duration-300"
          :class="isDarkTheme ? 'text-[#8E8E93]' : 'text-black'"
        />
      </div>

      <!-- Луна -->
      <div 
        class="flex w-[34px] h-7 items-center justify-center z-10"
      >
        <MoonIcon 
          class="w-4 h-4 transition-all duration-300"
          :class="isDarkTheme ? 'text-white' : 'text-[#8E8E93]'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(svg path) {
  transition: fill 0.3s ease;
}

.dark :deep(svg path) {
  fill: currentColor;
}
</style> 