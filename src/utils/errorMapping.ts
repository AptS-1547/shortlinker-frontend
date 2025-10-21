import type { ApiError } from '@/services/http'

/**
 * 将错误代码映射到 i18n 翻译键
 */
export function getErrorI18nKey(error: unknown): string {
  if (error instanceof Error && 'code' in error) {
    const apiError = error as ApiError

    switch (apiError.code) {
      case 'NETWORK_ERROR':
        return 'errors.network'
      case 'BAD_REQUEST':
        return 'errors.badRequest'
      case 'INVALID_CREDENTIALS':
      case 'UNAUTHORIZED':
        return 'errors.unauthorized'
      case 'FORBIDDEN':
        return 'errors.forbidden'
      case 'NOT_FOUND':
        return 'errors.notFound'
      case 'TOO_MANY_REQUESTS':
        return 'errors.tooManyRequests'
      case 'SERVER_ERROR':
        return 'errors.serverError'
      case 'SERVICE_UNAVAILABLE':
        return 'errors.serviceUnavailable'
      default:
        return 'errors.unknown'
    }
  }

  return 'errors.unknown'
}

/**
 * 获取用户友好的错误消息
 * @param error 错误对象
 * @param t i18n 翻译函数
 * @param fallback 后备消息
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  t: (key: string) => string,
  fallback?: string,
): string {
  const i18nKey = getErrorI18nKey(error)
  const message = t(i18nKey)

  // 如果翻译失败（返回的是 key 本身），使用后备消息或错误消息
  if (message === i18nKey) {
    if (fallback) return fallback
    if (error instanceof Error) return error.message
    return String(error)
  }

  return message
}

/**
 * 判断错误是否为网络错误
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    return (error as ApiError).code === 'NETWORK_ERROR'
  }
  return false
}

/**
 * 判断错误是否为认证错误
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const code = (error as ApiError).code
    return code === 'UNAUTHORIZED' || code === 'INVALID_CREDENTIALS'
  }
  return false
}

/**
 * 判断错误是否为服务器错误
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const code = (error as ApiError).code
    return code === 'SERVER_ERROR' || code === 'SERVICE_UNAVAILABLE'
  }
  return false
}

/**
 * 判断错误是否可以重试
 */
export function isRetryableError(error: unknown): boolean {
  return isNetworkError(error) || isServerError(error)
}
