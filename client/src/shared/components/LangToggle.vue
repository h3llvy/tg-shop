<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/shared/composables/useI18n'
import { useTheme } from '@/shared/composables/useTheme'

const { currentLanguage, toggleLanguage } = useI18n()
const { isDarkTheme } = useTheme()
const isAnimating = ref(false)

const handleToggle = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  toggleLanguage()
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<template>
  <div 
    class="flex h-8 p-0.5 items-center rounded-[99px] transition-colors duration-300 relative cursor-pointer"
    :class="isDarkTheme ? 'bg-[#2C2C2E]' : 'bg-[#EFEFF3]'"
    @click="handleToggle"
  >
    <!-- Подвижная кнопка -->
    <div
      class="absolute w-[34px] h-[28px] rounded-[99px] transition-all duration-300 ease-in-out border-[0.5px] border-black/[0.04]"
      :class="[
        currentLanguage === 'RU'
          ? 'translate-x-[34px]' 
          : 'translate-x-0',
        isDarkTheme 
          ? 'bg-black shadow-[0px_3px_8px_0px_rgba(0,0,0,0.12),0px_3px_1px_0px_rgba(0,0,0,0.04)]'
          : 'bg-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.12),0px_3px_1px_0px_rgba(0,0,0,0.04)]'
      ]"
    />

    <!-- Языки -->
    <div class="flex w-[68px] relative">
      <!-- EN -->
      <div 
        class="flex w-[34px] h-7 items-center justify-center z-10"
      >
        <span 
          class="text-sm font-medium transition-all duration-300"
          :class="[
            currentLanguage === 'RU' 
              ? 'text-[#8E8E93]' 
              : isDarkTheme ? 'text-white' : 'text-black'
          ]"
        >
          EN
        </span>
      </div>

      <!-- RU -->
      <div 
        class="flex w-[34px] h-7 items-center justify-center z-10"
      >
        <span 
          class="text-sm font-medium transition-all duration-300"
          :class="[
            currentLanguage === 'RU' 
              ? isDarkTheme ? 'text-white' : 'text-black'
              : 'text-[#8E8E93]'
          ]"
        >
          RU
        </span>
      </div>
    </div>
  </div>
</template> 