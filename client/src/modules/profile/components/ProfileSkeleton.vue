<script setup lang="ts">
const GRID_ITEMS_COUNT = 6
const items = Array(GRID_ITEMS_COUNT).fill(null)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="p-4">
      <div class="text-center">
        <!-- Скелетон аватара -->
        <div class="relative w-24 h-24 mx-auto mb-4">
          <div class="w-full h-full rounded-full bg-separator-light dark:bg-separator-dark animate-pulse" />
          <div class="absolute -bottom-1 right-0 w-6 h-6 rounded-full bg-separator-light dark:bg-separator-dark animate-pulse" />
        </div>

        <!-- Скелетон имени -->
        <div class="h-8 w-48 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto mb-2 animate-pulse" />
        <div class="h-5 w-32 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto animate-pulse" />

        <!-- Скелетон статистики -->
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4">
            <div class="h-8 w-16 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto mb-2 animate-pulse" />
            <div class="h-4 w-24 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto animate-pulse" />
          </div>
          <div class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4">
            <div class="h-8 w-16 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto mb-2 animate-pulse" />
            <div class="h-4 w-24 bg-separator-light dark:bg-separator-dark rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 