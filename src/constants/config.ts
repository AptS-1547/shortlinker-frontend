/**
 * 应用程序配置常量
 */

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken', // 注意：将迁移到 HttpOnly Cookie
  THEME: 'theme',
  LANGUAGE: 'language',
  PAGE_SIZE: 'pageSize',
} as const

/**
 * API 配置
 */
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 秒超时
  MAX_RETRIES: 3, // 最多重试 3 次
  RETRY_DELAY: 1000, // 重试延迟 1 秒
} as const

/**
 * 主题选项
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const

/**
 * 语言选项
 */
export const LANGUAGES = {
  ENGLISH: 'en',
  CHINESE: 'zh',
  JAPANESE: 'ja',
  FRENCH: 'fr',
  RUSSIAN: 'ru',
} as const

/**
 * Toast 提示持续时间（毫秒）
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const

/**
 * 防抖延迟时间（毫秒）
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  INPUT: 300,
  RESIZE: 150,
} as const

/**
 * 动画持续时间（毫秒）
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

/**
 * 短链接代码限制
 */
export const SHORT_CODE_LIMITS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 50,
  PATTERN: /^[a-zA-Z0-9_-]+$/,
} as const

/**
 * 密码限制
 */
export const PASSWORD_LIMITS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: false,
} as const
