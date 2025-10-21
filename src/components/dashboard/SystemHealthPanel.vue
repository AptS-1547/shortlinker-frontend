<template>
  <div
    class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-indigo-50/30 dark:from-green-900/10 dark:via-blue-900/10 dark:to-indigo-900/10 rounded-xl"
    ></div>
    <div class="relative">
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-lg font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent"
        >
          {{ $t('dashboard.systemHealth') }}
        </h2>
        <button
          @click="emit('refresh')"
          :disabled="loading"
          class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <RefreshIcon :class="['w-3 h-3 mr-1.5', { 'animate-spin': loading }]" />
          {{ $t('common.refresh') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          class="group relative p-3 bg-gradient-to-r from-indigo-50/80 to-indigo-100/40 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border border-indigo-200/50 dark:border-indigo-700/30 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-indigo-50/10 dark:from-indigo-900/10 dark:to-indigo-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative flex items-center gap-2 mb-1">
            <div
              class="p-1 bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-800/50 dark:to-indigo-700/30 rounded shadow-sm"
            >
              <DatabaseIcon className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
            </div>
            <span
              class="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide"
              >{{ $t('dashboard.storage') }}</span
            >
          </div>
          <p class="text-base font-bold text-indigo-900 dark:text-indigo-200 ml-6">
            {{ storageType }}
          </p>
        </div>

        <div
          class="group relative p-3 bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:from-amber-900/20 dark:to-amber-800/10 rounded-lg border border-amber-200/50 dark:border-amber-700/30 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-amber-50/10 dark:from-amber-900/10 dark:to-amber-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative flex items-center gap-2 mb-1">
            <div
              class="p-1 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/50 dark:to-amber-700/30 rounded shadow-sm"
            >
              <ClockIcon className="w-3 h-3 text-amber-700 dark:text-amber-400" />
            </div>
            <span
              class="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide"
              >{{ $t('dashboard.lastCheck') }}</span
            >
          </div>
          <p class="text-sm font-bold text-amber-900 dark:text-amber-200 ml-6">
            {{ lastCheck }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshIcon, DatabaseIcon, ClockIcon } from '@/components/icons'

interface Props {
  storageType: string
  lastCheck: string
  loading?: boolean
}

interface Emits {
  (e: 'refresh'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()
</script>
