<script setup lang="ts">
const ITEMS_COUNT = 10
const items = Array(ITEMS_COUNT).fill(null)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div class="sticky top-0 z-10 bg-bg-secondary-light dark:bg-bg-secondary-dark px-4 py-2">
      <div class="h-[36px] bg-separator-light dark:bg-separator-dark rounded-[12px] animate-pulse" />
    </div>

    <div class="pb-[105px]">
      <div 
        v-for="(_, index) in items" 
        :key="index"
        class="h-[72px] px-4 py-3 flex items-center justify-between border-b border-separator-light dark:border-separator-dark"
      >
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-separator-light dark:bg-separator-dark animate-pulse" />
          <div class="ml-3">
            <div class="h-5 w-32 bg-separator-light dark:bg-separator-dark rounded animate-pulse mb-1" />
            <div class="h-4 w-16 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
          </div>
        </div>
        <div class="h-6 w-6 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
      </div>
    </div>

    <div class="fixed bottom-[49px] left-0 right-0 bg-bg-secondary-light dark:bg-bg-secondary-dark border-t border-separator-light dark:border-separator-dark">
      <div class="flex items-center h-[56px] px-4">
        <div class="w-12 h-12 rounded-full bg-separator-light dark:bg-separator-dark animate-pulse" />
        <div class="ml-3 flex-1">
          <div class="h-5 w-32 bg-separator-light dark:bg-separator-dark rounded animate-pulse mb-1" />
          <div class="h-4 w-16 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
        </div>
        <div class="h-6 w-6 bg-separator-light dark:bg-separator-dark rounded animate-pulse" />
      </div>
    </div>
  </div>
</template> 