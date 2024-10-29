<script setup lang="ts">
const GRID_ITEMS_COUNT = 6
const items = Array(GRID_ITEMS_COUNT).fill(null)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="w-24 h-10 bg-separator-light dark:bg-separator-dark rounded-full animate-pulse" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full bg-separator-light dark:bg-separator-dark animate-pulse ring-4 ring-bg-secondary-light dark:ring-bg-secondary-dark" />
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-5 bg-label-secondary-light dark:bg-label-secondary-dark rounded-full animate-pulse" />
      </div>
      <div class="w-24 h-10 bg-separator-light dark:bg-separator-dark rounded-full animate-pulse" />
    </div>

    <div class="px-4">
      <div class="text-center mt-2 mb-4">
        <div class="h-6 w-40 bg-separator-light dark:bg-separator-dark rounded mx-auto animate-pulse mb-2" />
        <div class="h-4 w-24 bg-separator-light dark:bg-separator-dark rounded mx-auto animate-pulse" />
      </div>

      <div class="flex justify-center items-center py-3">
        <div class="h-6 w-32 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
      </div>

      <div class="grid grid-cols-3 gap-2 mt-4">
        <div 
          v-for="(_, index) in items" 
          :key="index"
          class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl aspect-square p-3 relative animate-pulse"
        >
          <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-separator-light dark:bg-separator-dark" />
          <div class="h-4 w-12 bg-separator-light dark:bg-separator-dark rounded absolute top-2 right-2" />
          <div class="w-12 h-12 bg-separator-light dark:bg-separator-dark rounded-full mx-auto mt-8" />
          <div class="h-4 w-16 bg-separator-light dark:bg-separator-dark rounded absolute bottom-2 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  </div>
</template> 