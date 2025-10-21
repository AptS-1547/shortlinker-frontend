<template>
  <Transition
    name="modal-backdrop"
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <Transition
        name="modal-content"
        enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-200 ease-in"
        enter-from-class="scale-95"
        enter-to-class="scale-100"
        leave-from-class="scale-100"
        leave-to-class="scale-95"
      >
        <div
          v-if="modelValue"
          class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/60 to-red-50/30 dark:from-gray-800/60 dark:to-red-900/20 rounded-2xl"
          ></div>
          <div class="relative text-center">
            <div
              class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/50 dark:to-red-800/30 rounded-full flex items-center justify-center shadow-lg"
            >
              <DeleteIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {{ $t('links.deleteLink') }}
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {{ $t('links.deleteConfirmation', { code: linkCode }) }}
            </p>

            <div class="flex justify-center space-x-4">
              <button
                @click="handleCancel"
                class="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 uppercase tracking-wide"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="loading"
                class="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                {{ loading ? $t('links.deleting') : $t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { DeleteIcon } from '@/components/icons'

interface Props {
  modelValue: boolean
  linkCode?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleCancel()
  }
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
