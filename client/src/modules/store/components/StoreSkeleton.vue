<script setup lang="ts">
const ITEMS_COUNT = 4
const items = Array(ITEMS_COUNT).fill(null)
</script>

<template>
  <div class="p-4 bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="flex items-center justify-center mb-4">
      <div class="w-12 h-12 bg-separator-light dark:bg-separator-dark rounded-full animate-pulse mr-2" />
      <div class="h-8 w-48 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
    </div>
    
    <div class="h-5 w-64 bg-separator-light dark:bg-separator-dark rounded mx-auto animate-pulse mb-8" />

    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="(_, index) in items" 
        :key="index"
        class="rounded-lg p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark animate-pulse"
      >
        <div class="w-full aspect-square bg-separator-light dark:bg-separator-dark rounded-lg mb-2" />
        <div class="h-5 w-32 bg-separator-light dark:bg-separator-dark rounded mb-2" />
        <div class="h-4 w-24 bg-separator-light dark:bg-separator-dark rounded mb-2" />
        <div class="h-5 w-16 bg-separator-light dark:bg-separator-dark rounded" />
      </div>
    </div>
  </div>
</template> 