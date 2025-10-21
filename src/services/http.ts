import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { config as appConfig } from '@/config'

// ==================== 错误处理 ====================
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const handleAuthError = (): void => {
  if (typeof window !== 'undefined') {
    // 不再使用 localStorage 存储 token
    // Cookie 会由后端自动清除
    window.location.href = '/login'
  }
}

export const createErrorHandler = (context: string) => {
  return (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      // 网络错误
      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
        throw new ApiError('Network Error: Cannot connect to server', undefined, 'NETWORK_ERROR')
      }

      // HTTP 状态码错误
      const status = axiosError.response?.status
      switch (status) {
        case 400:
          throw new ApiError(
            `400: Bad Request${context ? ` for ${context}` : ''}`,
            400,
            'BAD_REQUEST',
          )
        case 401:
          // 如果是登录接口，不要自动重定向
          if (axiosError.config?.url?.includes('/auth/login')) {
            throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
          }
          handleAuthError()
          throw new ApiError(
            `401: Unauthorized access${context ? ` to ${context}` : ''}`,
            401,
            'UNAUTHORIZED',
          )
        case 403:
          throw new ApiError(
            `403: Forbidden${context ? ` - insufficient permissions for ${context}` : ''}`,
            403,
            'FORBIDDEN',
          )
        case 404:
          throw new ApiError(`404: ${context || 'Resource'} not found`, 404, 'NOT_FOUND')
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
          throw new ApiError('503: Service temporarily unavailable', 503, 'SERVICE_UNAVAILABLE')
        default:
          throw new ApiError(
            `${status}: ${axiosError.response?.statusText || 'Unknown error'}`,
            status,
            'HTTP_ERROR',
          )
      }
    }

    throw error instanceof Error ? error : new ApiError('Unknown error occurred')
  }
}

// ==================== HTTP 客户端 ====================
export class HttpClient {
  private client: AxiosInstance

  constructor(baseURL: string, context: string = '') {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      timeout: 10000, // 10 秒超时
    })

    this.setupInterceptors(context)
  }

  private setupInterceptors(context: string): void {
    // 请求拦截器
    // 注意：不再需要手动添加 Authorization header
    // 认证通过 HttpOnly Cookie 自动发送
    this.client.interceptors.request.use((config) => {
      // 可以在这里添加其他请求头（如 X-Request-ID）
      return config
    })

    // 响应拦截器
    this.client.interceptors.response.use((response) => response, createErrorHandler(context))
  }

  async get<T = unknown>(url: string): Promise<T> {
    const response = await this.client.get(url)
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

  async delete<T = unknown>(url: string): Promise<T> {
    const response = await this.client.delete(url)
    return response.data
  }
}

// ==================== 客户端实例 ====================
// 获取基础 URL
const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return typeof window !== 'undefined' ? window.location.origin : ''
  }
  return appConfig.apiBaseUrl || 'http://127.0.0.1:8080'
}

const baseUrl = getBaseUrl()

// 导出配置对象（为了兼容性）
export const config = {
  baseUrl,
  adminRoutePrefix: appConfig.adminRoutePrefix,
  healthRoutePrefix: appConfig.healthRoutePrefix,
}

// 创建客户端实例
export const adminClient = new HttpClient(`${baseUrl}${appConfig.adminRoutePrefix}`, 'admin')
export const healthClient = new HttpClient(`${baseUrl}${appConfig.healthRoutePrefix}`, 'health')
