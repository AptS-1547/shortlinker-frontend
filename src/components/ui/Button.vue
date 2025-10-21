<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses" @click="handleClick">
    <SpinnerIcon v-if="loading" :class="iconClasses" />
    <slot v-if="!loading" name="icon" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SpinnerIcon } from '@/components/icons'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide'

const variantClasses = computed(() => {
  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-indigo-500 dark:to-purple-500 text-white hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-indigo-500 dark:hover:via-indigo-600 dark:hover:to-purple-600 focus:ring-indigo-500/50 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95',
    secondary:
      'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:ring-gray-500/50 shadow-sm hover:shadow-md transform hover:scale-105',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 focus:ring-red-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95',
    ghost:
      'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 focus:ring-gray-500/50',
    success:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-500 dark:hover:to-emerald-600 focus:ring-emerald-500/50 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return sizes[props.size]
})

const buttonClasses = computed(() => {
  return [baseClasses, variantClasses.value, sizeClasses.value, props.block ? 'w-full' : '']
})

const iconClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  return `${sizes[props.size]} animate-spin`
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
