import axios from 'axios'
import { appConfig } from '@/config/app'
import { adminClient } from './http'
import type {
  BatchCreateRequest,
  BatchDeleteRequest,
  BatchResponse,
  BatchUpdateRequest,
  GetLinksQuery,
  ImportMode,
  ImportResponse,
  PostNewLink,
} from './types'

interface ApiResponse<T> {
  code: number
  data: T
}

export class BatchService {
  /**
   * 批量创建链接
   */
  async createLinks(links: PostNewLink[]): Promise<BatchResponse> {
    const response = await adminClient.post<ApiResponse<BatchResponse>>(
      '/links/batch',
      { links } satisfies BatchCreateRequest,
    )

    // 清除链接列表和统计缓存
    adminClient.invalidateTags(['links-list', 'stats'])

    return response.data
  }

  /**
   * 批量更新链接
   */
  async updateLinks(
    updates: { code: string; payload: PostNewLink }[],
  ): Promise<BatchResponse> {
    const response = await adminClient.put<ApiResponse<BatchResponse>>(
      '/links/batch',
      { updates } satisfies BatchUpdateRequest,
    )

    // 清除链接列表 + 被更新的链接缓存 + 统计缓存
    const linkTags = updates.map((u) => `link:${u.code}`)
    adminClient.invalidateTags(['links-list', 'stats', ...linkTags])

    return response.data
  }

  /**
   * 批量删除链接
   */
  async deleteLinks(codes: string[]): Promise<BatchResponse> {
    const response = await adminClient.delete<ApiResponse<BatchResponse>>(
      '/links/batch',
      { codes } satisfies BatchDeleteRequest,
    )

    // 清除链接列表 + 被删除的链接缓存 + 统计缓存
    const linkTags = codes.map((code) => `link:${code}`)
    adminClient.invalidateTags(['links-list', 'stats', ...linkTags])

    return response.data
  }

  /**
   * 导出链接为 CSV
   */
  async exportLinks(query?: Partial<GetLinksQuery>): Promise<Blob> {
    // 构建查询参数
    const params = new URLSearchParams()
    if (query?.search) params.set('search', query.search)
    if (query?.created_after) params.set('created_after', query.created_after)
    if (query?.created_before)
      params.set('created_before', query.created_before)
    if (query?.only_expired) params.set('only_expired', 'true')
    if (query?.only_active) params.set('only_active', 'true')

    const queryString = params.toString()
    const url = `/links/export${queryString ? `?${queryString}` : ''}`

    // 使用 axios 直接请求以获取 blob
    const baseUrl = import.meta.env.PROD
      ? window.location.origin
      : appConfig.apiBaseUrl || 'http://127.0.0.1:8080'

    const response = await axios.get(
      `${baseUrl}${appConfig.adminRoutePrefix}${url}`,
      {
        responseType: 'blob',
        withCredentials: true,
      },
    )

    return response.data
  }

  /**
   * 从 CSV 导入链接
   */
  async importLinks(file: File, mode: ImportMode): Promise<ImportResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', mode)

    // 使用 axios 直接请求以发送 multipart/form-data
    const baseUrl = import.meta.env.PROD
      ? window.location.origin
      : appConfig.apiBaseUrl || 'http://127.0.0.1:8080'

    const response = await axios.post<ApiResponse<ImportResponse>>(
      `${baseUrl}${appConfig.adminRoutePrefix}/links/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      },
    )

    // 清除链接列表和统计缓存
    adminClient.invalidateTags(['links-list', 'stats'])

    return response.data.data
  }
}

export const batchService = new BatchService()
