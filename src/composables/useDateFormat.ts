import {
  formatDate as formatDateUtil,
  formatDateTime,
  formatRelativeTime,
} from '@/utils/dateFormatter'
import { useI18n } from 'vue-i18n'

/**
 * 日期格式化的 Composable
 * 支持国际化
 */
export function useDateFormat() {
  const { locale } = useI18n()

  /**
   * 格式化日期
   */
  function formatDate(dateString: string): string {
    return formatDateUtil(dateString, locale.value)
  }

  /**
   * 格式化日期时间
   */
  function formatDateTimeStr(dateString: string): string {
    return formatDateTime(dateString, locale.value)
  }

  /**
   * 格式化相对时间
   */
  function formatRelative(dateString: string): string {
    return formatRelativeTime(dateString, locale.value)
  }

  return {
    formatDate,
    formatDateTime: formatDateTimeStr,
    formatRelative,
  }
}
