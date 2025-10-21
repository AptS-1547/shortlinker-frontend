/**
 * 路由路径常量
 */

/**
 * 公共路由路径
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LINKS: '/links',
  ANALYTICS: '/analytics',
} as const

/**
 * 路由名称
 */
export const ROUTE_NAMES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  LINKS: 'links',
  ANALYTICS: 'analytics',
} as const

/**
 * 路由元数据键
 */
export const ROUTE_META_KEYS = {
  REQUIRES_AUTH: 'requiresAuth',
  TITLE: 'title',
  DESCRIPTION: 'description',
  ICON: 'icon',
} as const
