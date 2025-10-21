<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed top-6 right-6 z-50 space-y-3"
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="translate-x-full opacity-0 scale-95"
      enter-to-class="translate-x-0 opacity-100 scale-100"
      leave-from-class="translate-x-0 opacity-100 scale-100"
      leave-to-class="translate-x-full opacity-0 scale-95"
    >
      <div v-for="toast in toasts" :key="toast.id" :class="toastClasses(toast.type)">
        <div class="flex items-start gap-3">
          <component :is="getIcon(toast.type)" class="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <div class="font-bold text-lg">{{ toast.title }}</div>
            <div v-if="toast.message" class="text-sm mt-1 opacity-90">
              {{ toast.message }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoIcon,
} from '@/components/icons'
import { TOAST_DURATION } from '@/constants'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>()

function show(toast: Omit<Toast, 'id'>) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const duration = toast.duration || TOAST_DURATION.MEDIUM

  const newToast: Toast = {
    ...toast,
    id,
  }

  toasts.value.push(newToast)

  setTimeout(() => {
    remove(id)
  }, duration)

  return id
}

function remove(id: string) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

function toastClasses(type: ToastType) {
  const baseClasses =
    'px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ease-out min-w-[320px] max-w-md'

  const typeClasses = {
    success:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white border-emerald-400/50 dark:border-emerald-500/50',
    error:
      'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white border-red-400/50 dark:border-red-500/50',
    warning:
      'bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 text-white border-amber-400/50 dark:border-amber-500/50',
    info: 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white border-indigo-400/50 dark:border-indigo-500/50',
  }

  return `${baseClasses} ${typeClasses[type]}`
}

function getIcon(type: ToastType) {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InfoIcon,
  }
  return icons[type]
}

defineExpose({
  show,
  remove,
})
</script>
