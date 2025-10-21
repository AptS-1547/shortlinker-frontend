import { ref } from 'vue'

/**
 * 确认对话框的 Composable
 */
export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary' | 'success'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export function useConfirm() {
  const isOpen = ref(false)
  const loading = ref(false)
  const currentOptions = ref<ConfirmOptions | null>(null)

  async function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      currentOptions.value = {
        ...options,
        onConfirm: async () => {
          if (options.onConfirm) {
            loading.value = true
            try {
              await options.onConfirm()
              resolve(true)
            } catch (error) {
              console.error('Confirm action failed:', error)
              resolve(false)
            } finally {
              loading.value = false
              isOpen.value = false
            }
          } else {
            resolve(true)
            isOpen.value = false
          }
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel()
          }
          resolve(false)
          isOpen.value = false
        },
      }

      isOpen.value = true
    })
  }

  function cancel() {
    if (currentOptions.value?.onCancel) {
      currentOptions.value.onCancel()
    }
    isOpen.value = false
  }

  return {
    isOpen,
    loading,
    currentOptions,
    confirm,
    cancel,
  }
}
