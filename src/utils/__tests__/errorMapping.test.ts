import { describe, expect, it } from 'vitest'
import {
  getErrorI18nKey,
  getUserFriendlyErrorMessage,
  isNetworkError,
  isAuthenticationError,
  isServerError,
  isRetryableError,
} from '../errorMapping'
import type { ApiError } from '@/services/http'

// Helper to create mock ApiError
function createApiError(code: string, message = 'Test error'): ApiError {
  const error = new Error(message) as ApiError
  error.code = code
  return error
}

describe('errorMapping', () => {
  // ==========================================================================
  // getErrorI18nKey
  // ==========================================================================

  describe('getErrorI18nKey', () => {
    it('should return errors.network for NETWORK_ERROR', () => {
      const error = createApiError('NETWORK_ERROR')
      expect(getErrorI18nKey(error)).toBe('errors.network')
    })

    it('should return errors.badRequest for BAD_REQUEST', () => {
      const error = createApiError('BAD_REQUEST')
      expect(getErrorI18nKey(error)).toBe('errors.badRequest')
    })

    it('should return errors.unauthorized for INVALID_CREDENTIALS', () => {
      const error = createApiError('INVALID_CREDENTIALS')
      expect(getErrorI18nKey(error)).toBe('errors.unauthorized')
    })

    it('should return errors.unauthorized for UNAUTHORIZED', () => {
      const error = createApiError('UNAUTHORIZED')
      expect(getErrorI18nKey(error)).toBe('errors.unauthorized')
    })

    it('should return errors.forbidden for FORBIDDEN', () => {
      const error = createApiError('FORBIDDEN')
      expect(getErrorI18nKey(error)).toBe('errors.forbidden')
    })

    it('should return errors.notFound for NOT_FOUND', () => {
      const error = createApiError('NOT_FOUND')
      expect(getErrorI18nKey(error)).toBe('errors.notFound')
    })

    it('should return errors.tooManyRequests for TOO_MANY_REQUESTS', () => {
      const error = createApiError('TOO_MANY_REQUESTS')
      expect(getErrorI18nKey(error)).toBe('errors.tooManyRequests')
    })

    it('should return errors.serverError for SERVER_ERROR', () => {
      const error = createApiError('SERVER_ERROR')
      expect(getErrorI18nKey(error)).toBe('errors.serverError')
    })

    it('should return errors.serviceUnavailable for SERVICE_UNAVAILABLE', () => {
      const error = createApiError('SERVICE_UNAVAILABLE')
      expect(getErrorI18nKey(error)).toBe('errors.serviceUnavailable')
    })

    it('should return errors.unknown for unknown code', () => {
      const error = createApiError('UNKNOWN_CODE')
      expect(getErrorI18nKey(error)).toBe('errors.unknown')
    })

    it('should return errors.unknown for non-Error object', () => {
      expect(getErrorI18nKey('string error')).toBe('errors.unknown')
    })

    it('should return errors.unknown for null', () => {
      expect(getErrorI18nKey(null)).toBe('errors.unknown')
    })

    it('should return errors.unknown for Error without code', () => {
      const error = new Error('No code')
      expect(getErrorI18nKey(error)).toBe('errors.unknown')
    })
  })

  // ==========================================================================
  // getUserFriendlyErrorMessage
  // ==========================================================================

  describe('getUserFriendlyErrorMessage', () => {
    const mockTranslate = (key: string): string => {
      const translations: Record<string, string> = {
        'errors.network': 'Network connection failed',
        'errors.unauthorized': 'Please log in again',
        'errors.unknown': 'errors.unknown', // Simulate untranslated key
      }
      return translations[key] || key
    }

    it('should return translated message for known error', () => {
      const error = createApiError('NETWORK_ERROR')
      const result = getUserFriendlyErrorMessage(error, mockTranslate)
      expect(result).toBe('Network connection failed')
    })

    it('should return fallback when translation fails', () => {
      const error = createApiError('UNKNOWN_CODE')
      const result = getUserFriendlyErrorMessage(error, mockTranslate, 'Fallback message')
      expect(result).toBe('Fallback message')
    })

    it('should return error message when no translation and no fallback', () => {
      const error = createApiError('UNKNOWN_CODE', 'Original error message')
      const result = getUserFriendlyErrorMessage(error, mockTranslate)
      expect(result).toBe('Original error message')
    })

    it('should return stringified error for non-Error objects', () => {
      const result = getUserFriendlyErrorMessage('string error', mockTranslate)
      expect(result).toBe('string error')
    })
  })

  // ==========================================================================
  // isNetworkError
  // ==========================================================================

  describe('isNetworkError', () => {
    it('should return true for NETWORK_ERROR code', () => {
      const error = createApiError('NETWORK_ERROR')
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return false for other error codes', () => {
      const error = createApiError('SERVER_ERROR')
      expect(isNetworkError(error)).toBe(false)
    })

    it('should return false for non-ApiError', () => {
      expect(isNetworkError(new Error('test'))).toBe(false)
    })

    it('should return false for null', () => {
      expect(isNetworkError(null)).toBe(false)
    })
  })

  // ==========================================================================
  // isAuthenticationError
  // ==========================================================================

  describe('isAuthenticationError', () => {
    it('should return true for UNAUTHORIZED code', () => {
      const error = createApiError('UNAUTHORIZED')
      expect(isAuthenticationError(error)).toBe(true)
    })

    it('should return true for INVALID_CREDENTIALS code', () => {
      const error = createApiError('INVALID_CREDENTIALS')
      expect(isAuthenticationError(error)).toBe(true)
    })

    it('should return false for other error codes', () => {
      const error = createApiError('FORBIDDEN')
      expect(isAuthenticationError(error)).toBe(false)
    })

    it('should return false for non-ApiError', () => {
      expect(isAuthenticationError('string')).toBe(false)
    })
  })

  // ==========================================================================
  // isServerError
  // ==========================================================================

  describe('isServerError', () => {
    it('should return true for SERVER_ERROR code', () => {
      const error = createApiError('SERVER_ERROR')
      expect(isServerError(error)).toBe(true)
    })

    it('should return true for SERVICE_UNAVAILABLE code', () => {
      const error = createApiError('SERVICE_UNAVAILABLE')
      expect(isServerError(error)).toBe(true)
    })

    it('should return false for other error codes', () => {
      const error = createApiError('BAD_REQUEST')
      expect(isServerError(error)).toBe(false)
    })

    it('should return false for non-ApiError', () => {
      expect(isServerError(undefined)).toBe(false)
    })
  })

  // ==========================================================================
  // isRetryableError
  // ==========================================================================

  describe('isRetryableError', () => {
    it('should return true for network errors', () => {
      const error = createApiError('NETWORK_ERROR')
      expect(isRetryableError(error)).toBe(true)
    })

    it('should return true for server errors', () => {
      const error = createApiError('SERVER_ERROR')
      expect(isRetryableError(error)).toBe(true)
    })

    it('should return true for service unavailable', () => {
      const error = createApiError('SERVICE_UNAVAILABLE')
      expect(isRetryableError(error)).toBe(true)
    })

    it('should return false for client errors', () => {
      const error = createApiError('BAD_REQUEST')
      expect(isRetryableError(error)).toBe(false)
    })

    it('should return false for auth errors', () => {
      const error = createApiError('UNAUTHORIZED')
      expect(isRetryableError(error)).toBe(false)
    })
  })
})
