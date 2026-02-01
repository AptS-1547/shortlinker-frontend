import type { ApiError } from '@/services/http'
import { ErrorCode } from '@/services/types.generated'

/**
 * 类型守卫：判断错误是否为 ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    'errorCode' in error &&
    typeof (error as ApiError).errorCode === 'number'
  )
}

/**
 * 将错误代码映射到 i18n 翻译键
 */
export function getErrorI18nKey(error: unknown): string {
  // 网络错误优先检测（可能没有 code 属性）
  if (error instanceof Error && error.message?.includes('Network Error')) {
    return 'errors.network'
  }

  if (error instanceof Error && 'code' in error) {
    const apiError = error as ApiError

    switch (apiError.code) {
      // 通用错误
      case ErrorCode.BadRequest:
        return 'errors.badRequest'
      case ErrorCode.Unauthorized:
        return 'errors.unauthorized'
      case ErrorCode.Forbidden:
        return 'errors.forbidden'
      case ErrorCode.NotFound:
        return 'errors.notFound'
      case ErrorCode.Conflict:
        return 'errors.conflict'
      case ErrorCode.RateLimitExceeded:
        return 'errors.tooManyRequests'
      case ErrorCode.InternalServerError:
        return 'errors.serverError'
      case ErrorCode.ServiceUnavailable:
        return 'errors.serviceUnavailable'

      // 认证错误
      case ErrorCode.AuthFailed:
        return 'errors.authFailed'
      case ErrorCode.TokenExpired:
        return 'errors.tokenExpired'
      case ErrorCode.TokenInvalid:
        return 'errors.tokenInvalid'
      case ErrorCode.CsrfInvalid:
        return 'errors.csrfInvalid'

      // 链接错误
      case ErrorCode.LinkNotFound:
        return 'errors.linkNotFound'
      case ErrorCode.LinkAlreadyExists:
        return 'errors.linkAlreadyExists'
      case ErrorCode.LinkInvalidUrl:
        return 'errors.linkInvalidUrl'
      case ErrorCode.LinkInvalidExpireTime:
        return 'errors.linkInvalidExpireTime'
      case ErrorCode.LinkPasswordHashError:
        return 'errors.linkPasswordHashError'
      case ErrorCode.LinkDatabaseError:
        return 'errors.linkDatabaseError'
      case ErrorCode.LinkEmptyCode:
        return 'errors.linkEmptyCode'

      // 导入导出错误
      case ErrorCode.ImportFailed:
        return 'errors.importFailed'
      case ErrorCode.ExportFailed:
        return 'errors.exportFailed'
      case ErrorCode.InvalidMultipartData:
        return 'errors.invalidMultipartData'
      case ErrorCode.FileReadError:
        return 'errors.fileReadError'
      case ErrorCode.CsvFileMissing:
        return 'errors.csvFileMissing'
      case ErrorCode.CsvParseError:
        return 'errors.csvParseError'
      case ErrorCode.CsvGenerationError:
        return 'errors.csvGenerationError'

      // 配置错误
      case ErrorCode.ConfigNotFound:
        return 'errors.configNotFound'
      case ErrorCode.ConfigUpdateFailed:
        return 'errors.configUpdateFailed'
      case ErrorCode.ConfigReloadFailed:
        return 'errors.configReloadFailed'

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
  if (error instanceof Error) {
    // 网络错误的 code 为 undefined，通过 message 判断
    return error.message?.includes('Network Error') === true
  }
  return false
}

/**
 * 判断错误是否为认证错误
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const code = (error as ApiError).code
    return (
      code === ErrorCode.Unauthorized ||
      code === ErrorCode.AuthFailed ||
      code === ErrorCode.TokenExpired ||
      code === ErrorCode.TokenInvalid
    )
  }
  return false
}

/**
 * 判断错误是否为服务器错误
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const code = (error as ApiError).code
    return (
      code === ErrorCode.InternalServerError ||
      code === ErrorCode.ServiceUnavailable
    )
  }
  return false
}

/**
 * 判断错误是否可以重试
 */
export function isRetryableError(error: unknown): boolean {
  return isNetworkError(error) || isServerError(error)
}
