/**
 * 链接状态相关常量
 */

/**
 * 链接状态类型
 */
export const LINK_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PERMANENT: 'permanent',
  TEMPORARY: 'temporary',
} as const

/**
 * 链接状态显示文本（国际化键）
 */
export const LINK_STATUS_LABELS: Record<string, string> = {
  active: 'links.active',
  expired: 'links.expired',
  permanent: 'links.permanent',
  temporary: 'links.temporary',
}

/**
 * 链接状态颜色类
 */
export const LINK_STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
  expired: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  permanent: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
  temporary: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
}

/**
 * 链接筛选选项
 */
export const LINK_FILTER_OPTIONS = [
  { value: '', label: 'links.filterOptions.allLinks' },
  { value: 'active', label: 'links.filterOptions.activeOnly' },
  { value: 'expired', label: 'links.filterOptions.expiredOnly' },
  { value: 'permanent', label: 'links.filterOptions.permanentLinks' },
  { value: 'temporary', label: 'links.filterOptions.temporaryLinks' },
] as const

export type LinkStatus = (typeof LINK_STATUS)[keyof typeof LINK_STATUS]
