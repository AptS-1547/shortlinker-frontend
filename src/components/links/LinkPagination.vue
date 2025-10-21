<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-200/70 dark:border-gray-700/70"
  >
    <div class="flex items-center gap-2">
      <button
        @click="emit('prev')"
        :disabled="!hasPrev"
        class="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('common.previous') }}
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{
          $t('links.pagination.showing', {
            from: (currentPage - 1) * pageSize + 1,
            to: Math.min(currentPage * pageSize, total),
            total: total,
          })
        }}
      </span>
    </div>

    <div class="flex items-center gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="emit('goto', page)"
        :class="[
          'px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300',
          page === currentPage
            ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
            : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
        ]"
      >
        {{ page }}
      </button>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="emit('next')"
        :disabled="!hasNext"
        class="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('common.next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface Emits {
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'goto', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2

  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else if (end === total) {
      start = Math.max(1, end - 4)
    }
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
