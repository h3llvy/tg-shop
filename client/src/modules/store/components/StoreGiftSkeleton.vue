<script setup lang="ts">
// Компонент скелетона для страницы подарка
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="px-4 mb-4 pt-6">
      <!-- Скелетон карточки подарка -->
      <div class="relative w-[361px] h-[361px] mx-auto rounded-xl bg-white overflow-hidden">
        <div class="absolute inset-0 bg-gray-100 animate-pulse"></div>
        <div class="relative z-10 flex justify-center items-center h-full">
          <div class="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Скелетон названия и количества -->
      <div class="mt-3 flex items-center gap-3">
        <div class="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-7 w-24 bg-gray-100 rounded-full animate-pulse"></div>
      </div>

      <!-- Скелетон описания -->
      <div class="mt-3 h-[22px] w-[329px] bg-gray-100 rounded animate-pulse"></div>

      <!-- Скелетон цены -->
      <div class="mt-3 h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
    </div>

    <!-- Разделитель -->
    <div class="h-3 bg-[#EFEFF3] w-full"></div>

    <!-- Скелетон истории -->
    <div class="px-4 mt-6">
      <!-- Заголовок истории -->
      <div class="h-[18px] w-32 bg-gray-100 rounded animate-pulse"></div>

      <!-- Элементы истории -->
      <div class="mt-4 space-y-4">
        <div 
          v-for="i in 3" 
          :key="i"
          class="flex items-start gap-3"
        >
          <!-- Скелетон аватара -->
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
          </div>

          <!-- Скелетон текста -->
          <div class="flex-1">
            <div class="h-4 w-20 bg-gray-100 rounded animate-pulse mb-1"></div>
            <div class="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 