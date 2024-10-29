<script setup lang="ts">
const items = Array(9).fill(null)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <!-- Скелетон заголовка -->
    <div class="px-4 py-6 text-center">
      <div class="h-8 w-64 bg-separator-light dark:bg-separator-dark rounded mx-auto animate-pulse mb-2"></div>
      <div class="h-5 w-48 bg-separator-light dark:bg-separator-dark rounded mx-auto animate-pulse"></div>
    </div>

    <!-- Скелетон сетки подарков -->
    <div class="grid grid-cols-3 gap-4 px-4">
      <div 
        v-for="(_, index) in items" 
        :key="index"
        class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4 flex flex-col items-center animate-pulse"
      >
        <!-- Скелетон названия -->
        <div class="h-4 w-20 bg-separator-light dark:bg-separator-dark rounded mb-4"></div>
        
        <!-- Скелетон иконки -->
        <div class="w-16 h-16 bg-separator-light dark:bg-separator-dark rounded-full my-4"></div>
        
        <!-- Скелетон кнопки -->
        <div class="w-full h-8 bg-separator-light dark:bg-separator-dark rounded-lg mt-auto"></div>
      </div>
    </div>
  </div>
</template> 