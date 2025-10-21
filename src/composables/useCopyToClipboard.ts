import { ref } from 'vue'
import { copyToClipboard, type CopyResult } from '@/utils/clipboard'

/**
 * 复制到剪贴板的 Composable
 * 提供复制功能和状态管理
 */
export function useCopyToClipboard() {
  const copied = ref(false)
  const error = ref<Error | null>(null)

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  /**
   * 复制文本到剪贴板
   * @param text - 要复制的文本
   * @param resetDelay - 重置状态的延迟时间（毫秒）
   * @returns 复制是否成功
   */
  async function copy(text: string, resetDelay: number = 2000): Promise<boolean> {
    error.value = null

    const result: CopyResult = await copyToClipboard(text)

    if (result.success) {
      copied.value = true

      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // 设置新的定时器来重置状态
      timeoutId = setTimeout(() => {
        copied.value = false
      }, resetDelay)

      return true
    } else {
      error.value = result.error || new Error('Copy failed')
      return false
    }
  }

  /**
   * 手动重置复制状态
   */
  function reset() {
    copied.value = false
    error.value = null
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    copied,
    error,
    copy,
    reset,
  }
}
