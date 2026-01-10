import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { appConfig } from '@/config/app'
import { forceLogout, refreshTokenFromHttp } from '@/stores/authStore'

// ==================== 错误处理 ====================
export class ApiError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const handleAuthError = (): void => {
  if (typeof window !== 'undefined') {
    // 同步更新 authStore 状态
    forceLogout()
    // Cookie is automatically managed by browser, no localStorage cleanup needed
    const basePath = appConfig.basePath
    const loginPath =
      basePath && basePath !== '/' ? `${basePath}/login` : '/login'
    window.location.href = loginPath
  }
}

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

// ==================== HTTP 客户端 ====================
export class HttpClient {
  private client: AxiosInstance
  private context: string

  constructor(baseURL: string, context: string = '') {
    this.context = context
    this.client = axios.create({
      baseURL,
      withCredentials: true, // Important: send cookies automatically
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor - no Authorization header needed, cookies are sent automatically
    this.client.interceptors.request.use((config) => config)

    // Response interceptor with token refresh logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        // Handle 401 errors
        if (error.response?.status === 401) {
          console.log('[HTTP] 401 intercepted for:', originalRequest?.url)

          // Don't retry for auth endpoints
          if (
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh') ||
            originalRequest?.url?.includes('/auth/verify')
          ) {
            console.log('[HTTP] 401 on auth endpoint, not retrying')
            return this.handleHttpError(error)
          }

          // Already retried, redirect to login
          if (originalRequest?._retry) {
            console.log('[HTTP] 401 already retried, redirecting to login')
            handleAuthError()
            return this.handleHttpError(error)
          }

          // Try to refresh token using authStore's unified refresh logic
          if (!isRefreshing) {
            console.log('[HTTP] 401 triggering token refresh')
            isRefreshing = true
            refreshPromise = refreshTokenFromHttp()
              .then(() => {
                console.log('[HTTP] Token refresh success, retrying request')
                isRefreshing = false
                refreshPromise = null
              })
              .catch(() => {
                console.log('[HTTP] Token refresh failed, redirecting to login')
                isRefreshing = false
                refreshPromise = null
                handleAuthError()
                throw error
              })
          } else {
            console.log('[HTTP] 401 waiting for ongoing refresh')
          }

          // Wait for refresh to complete
          try {
            await refreshPromise
            // Mark as retried and retry original request
            originalRequest._retry = true
            console.log(
              '[HTTP] Retrying original request:',
              originalRequest?.url,
            )
            return this.client.request(originalRequest)
          } catch {
            return this.handleHttpError(error)
          }
        }

        return this.handleHttpError(error)
      },
    )
  }

  private handleHttpError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      // Canceled request (AbortController)
      if (axiosError.code === 'ERR_CANCELED') {
        const cancelError = new Error('Request canceled')
        cancelError.name = 'AbortError'
        throw cancelError
      }

      // Network error
      if (
        axiosError.code === 'ECONNREFUSED' ||
        axiosError.code === 'ERR_NETWORK'
      ) {
        throw new ApiError(
          'Network Error: Cannot connect to server',
          undefined,
          'NETWORK_ERROR',
        )
      }

      const status = axiosError.response?.status
      const context = this.context

      switch (status) {
        case 400:
          throw new ApiError(
            `400: Bad Request${context ? ` for ${context}` : ''}`,
            400,
            'BAD_REQUEST',
          )
        case 401:
          throw new ApiError(
            axiosError.config?.url?.includes('/auth/login')
              ? 'Invalid credentials'
              : `401: Unauthorized access${context ? ` to ${context}` : ''}`,
            401,
            axiosError.config?.url?.includes('/auth/login')
              ? 'INVALID_CREDENTIALS'
              : 'UNAUTHORIZED',
          )
        case 403:
          throw new ApiError(
            `403: Forbidden${context ? ` - insufficient permissions for ${context}` : ''}`,
            403,
            'FORBIDDEN',
          )
        case 404:
          throw new ApiError(
            `404: ${context || 'Resource'} not found`,
            404,
            'NOT_FOUND',
          )
        case 429:
          throw new ApiError(
            '429: Too many requests - please try again later',
            429,
            'TOO_MANY_REQUESTS',
          )
        case 500:
          throw new ApiError(
            `500: ${context ? `${context} failed` : 'Internal server error'}`,
            500,
            'SERVER_ERROR',
          )
        case 503:
          throw new ApiError(
            '503: Service temporarily unavailable',
            503,
            'SERVICE_UNAVAILABLE',
          )
        default:
          throw new ApiError(
            `${status}: ${axiosError.response?.statusText || 'Unknown error'}`,
            status,
            'HTTP_ERROR',
          )
      }
    }

    throw error instanceof Error
      ? error
      : new ApiError('Unknown error occurred')
  }

  async get<T = unknown>(
    url: string,
    options?: { signal?: AbortSignal },
  ): Promise<T> {
    const response = await this.client.get(url, { signal: options?.signal })
    return response.data
  }

  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post(url, data)
    return response.data
  }

  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async delete<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.delete(url, { data })
    return response.data
  }
}

// ==================== 客户端实例 ====================
const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return typeof window !== 'undefined' ? window.location.origin : ''
  }
  return appConfig.apiBaseUrl || 'http://127.0.0.1:8080'
}

const baseUrl = getBaseUrl()

// Export config for compatibility
export const config = {
  baseUrl,
  adminRoutePrefix: appConfig.adminRoutePrefix,
  healthRoutePrefix: appConfig.healthRoutePrefix,
}

// Create client instances
export const adminClient = new HttpClient(
  `${baseUrl}${appConfig.adminRoutePrefix}`,
  'admin',
)
export const healthClient = new HttpClient(
  `${baseUrl}${appConfig.healthRoutePrefix}`,
  'health',
)
