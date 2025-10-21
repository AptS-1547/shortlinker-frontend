<template>
  <div class="text-center py-12">
    <div
      class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
    >
      <component :is="icon" class="w-10 h-10 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
      {{ title }}
    </h3>
    <p class="text-gray-700 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="flex items-center justify-center gap-3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Component } from 'vue'
import { LinkIcon, FilterIcon, DatabaseIcon } from '@/components/icons'

interface Props {
  icon?: Component
  title: string
  description: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: LinkIcon,
})
</script>
