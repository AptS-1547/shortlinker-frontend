<template>
  <div v-if="hasError" class="error-boundary">
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12"
    >
      <div
        class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <!-- Error Icon -->
        <div
          class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/50 dark:to-red-800/30 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <!-- Error Title -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-3">
          {{ $t('errors.boundary.title') }}
        </h1>

        <!-- Error Message -->
        <p class="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
          {{ $t('errors.boundary.description') }}
        </p>

        <!-- Error Details (Collapsible) -->
        <div v-if="errorDetails" class="mb-6">
          <button
            @click="showDetails = !showDetails"
            class="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
          >
            <span class="font-medium">{{ $t('errors.boundary.technicalDetails') }}</span>
            <svg
              :class="['w-4 h-4 transition-transform', { 'rotate-180': showDetails }]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            v-show="showDetails"
            class="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <pre
              class="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-words"
              >{{ errorDetails }}</pre
            >
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleReload"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white font-bold rounded-lg hover:from-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            {{ $t('errors.boundary.reload') }}
          </button>

          <button
            @click="handleGoHome"
            class="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            {{ $t('errors.boundary.goHome') }}
          </button>
        </div>

        <!-- Contact Support -->
        <p class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {{ $t('errors.boundary.persistentIssue') }}
        </p>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const hasError = ref(false)
const errorDetails = ref<string>('')
const showDetails = ref(false)

// 捕获子组件的错误
onErrorCaptured((err: unknown, instance, info) => {
  hasError.value = true

  // 构建错误详情
  const error = err as Error
  errorDetails.value = `Error: ${error.message}\n\nStack: ${error.stack}\n\nComponent Info: ${info}`

  // 记录到控制台
  console.error('[ErrorBoundary] Captured error:', {
    error,
    instance,
    info,
  })

  // 阻止错误继续向上传播
  return false
})

// 全局未处理的错误
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (!hasError.value) {
      hasError.value = true
      errorDetails.value = `Error: ${event.message}\n\nSource: ${event.filename}:${event.lineno}:${event.colno}`
      console.error('[ErrorBoundary] Global error:', event.error)
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (!hasError.value) {
      hasError.value = true
      errorDetails.value = `Unhandled Promise Rejection: ${event.reason}`
      console.error('[ErrorBoundary] Unhandled rejection:', event.reason)
    }
  })
}

function handleReload() {
  window.location.reload()
}

function handleGoHome() {
  hasError.value = false
  errorDetails.value = ''
  router.push('/')
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
}
</style>
