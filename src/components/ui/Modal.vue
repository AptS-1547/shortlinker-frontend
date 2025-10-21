<template>
  <Teleport to="body">
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
          <div v-if="modelValue" :class="modalClasses" @click.stop>
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/30 dark:from-gray-800/60 dark:to-gray-900/30 rounded-2xl"
            ></div>
            <div class="relative">
              <!-- Header -->
              <div v-if="title || $slots.header" class="mb-6">
                <slot name="header">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {{ title }}
                  </h3>
                </slot>
              </div>

              <!-- Content -->
              <div class="mb-6">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="flex justify-end space-x-3">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  modelValue: boolean
  title?: string
  size?: ModalSize
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modalClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return [
    'relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-gray-200/50 dark:border-gray-700/50 w-full',
    sizes[props.size],
  ]
})

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.modal-backdrop-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-backdrop-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
