/**
 * 分页相关常量
 */

/**
 * 默认页面大小
 */
export const DEFAULT_PAGE_SIZE = 20

/**
 * 可选的页面大小选项
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

/**
 * 最小页码
 */
export const MIN_PAGE = 1

/**
 * 分页显示时，当前页码周围显示的页数
 */
export const PAGINATION_DELTA = 2

/**
 * 分页器最多显示的页码按钮数量
 */
export const MAX_VISIBLE_PAGES = 5

/**
 * 分页类型
 */
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
