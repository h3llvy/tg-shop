<script setup lang="ts">
import { watchEffect, onMounted, onUnmounted } from 'vue'
import { backButton, useSignal } from '@telegram-apps/sdk-vue'

const isVisible = useSignal(backButton.isVisible)

watchEffect(() => {
  console.log('The button is', isVisible.value ? 'visible' : 'invisible')
})

onMounted(() => {
  backButton.show()
})

onUnmounted(() => {
  backButton.hide()
})
</script>
