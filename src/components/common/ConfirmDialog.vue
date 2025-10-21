<template>
  <Modal v-model="isOpen" :size="size" :close-on-backdrop="!loading">
    <template #header>
      <div class="flex items-center gap-3">
        <div :class="iconContainerClasses">
          <component :is="icon" class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </div>
    </template>

    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {{ message }}
    </p>

    <template #footer>
      <Button
        v-if="cancelText"
        variant="secondary"
        size="md"
        :disabled="loading"
        @click="handleCancel"
      >
        {{ cancelText }}
      </Button>
      <Button :variant="variant" size="md" :loading="loading" @click="handleConfirm">
        {{ confirmText }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '../ui/Modal.vue'
import Button from '../ui/Button.vue'
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InfoIcon,
  CheckCircleIcon,
} from '@/components/icons'

type ConfirmVariant = 'danger' | 'primary' | 'success'
type ModalSize = 'sm' | 'md' | 'lg'

interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  size?: ModalSize
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
  size: 'md',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = ref(false)

const icon = computed(() => {
  const icons = {
    danger: ExclamationTriangleIcon,
    primary: InfoIcon,
    success: CheckCircleIcon,
  }
  return icons[props.variant]
})

const iconContainerClasses = computed(() => {
  const classes = {
    danger:
      'w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/50 dark:to-red-800/30 rounded-full flex items-center justify-center shadow-lg text-red-600 dark:text-red-400',
    primary:
      'w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-full flex items-center justify-center shadow-lg text-indigo-600 dark:text-indigo-400',
    success:
      'w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-full flex items-center justify-center shadow-lg text-emerald-600 dark:text-emerald-400',
  }
  return classes[props.variant]
})

function show() {
  isOpen.value = true
}

function hide() {
  isOpen.value = false
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide,
})
</script>
