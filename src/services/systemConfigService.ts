import { adminClient } from './http'
import type {
  SystemConfigHistory,
  SystemConfigItem,
  SystemConfigUpdateRequest,
  SystemConfigUpdateResponse,
} from './types'
import type { ConfigSchema, ReloadResponse } from './types.generated'

export class SystemConfigService {
  /**
   * 获取所有配置
   * @param signal - 用于取消请求的 AbortSignal
   * @param skipCache - 是否跳过缓存，默认 false
   */
  async fetchAll(
    signal?: AbortSignal,
    skipCache = false,
  ): Promise<SystemConfigItem[]> {
    if (skipCache) {
      adminClient.invalidateTags(['config-all'])
    }
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigItem[]
    }>('/config', { signal, skipCache })
    return response.data || []
  }

  /**
   * 获取单个配置
   * @param key - 配置键
   * @param signal - 用于取消请求的 AbortSignal
   * @param skipCache - 是否跳过缓存，默认 false
   */
  async fetchOne(
    key: string,
    signal?: AbortSignal,
    skipCache = false,
  ): Promise<SystemConfigItem | null> {
    if (skipCache) {
      adminClient.invalidateTags([`config:${key}`, 'config-all'])
    }
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigItem
    }>(`/config/${encodeURIComponent(key)}`, { signal, skipCache })
    return response.data || null
  }

  /**
   * 更新配置
   */
  async update(
    key: string,
    value: string,
  ): Promise<SystemConfigUpdateResponse> {
    const payload: SystemConfigUpdateRequest = { value }
    const response = await adminClient.put<{
      code?: number
      data?: SystemConfigUpdateResponse
    }>(`/config/${encodeURIComponent(key)}`, payload)

    // 清除该配置项 + 全部配置列表的缓存
    adminClient.invalidateTags([`config:${key}`, 'config-all'])

    return (
      response.data || {
        key,
        value,
        requires_restart: false,
        is_sensitive: false,
        message: null,
      }
    )
  }

  /**
   * 获取配置历史
   */
  async fetchHistory(
    key: string,
    limit: number = 20,
    signal?: AbortSignal,
  ): Promise<SystemConfigHistory[]> {
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigHistory[]
    }>(`/config/${encodeURIComponent(key)}/history?limit=${limit}`, { signal })
    return response.data || []
  }

  /**
   * 重新加载配置
   */
  async reload(): Promise<ReloadResponse> {
    const response = await adminClient.post<{
      code?: number
      data?: ReloadResponse
    }>('/config/reload', {})

    // 清除所有配置缓存
    adminClient.invalidateTags(['config-all'])

    return (
      response.data || { message: 'Config reloaded', duration_ms: BigInt(0) }
    )
  }

  /**
   * 获取所有配置的 schema
   */
  async fetchSchema(signal?: AbortSignal): Promise<ConfigSchema[]> {
    const response = await adminClient.get<{
      code?: number
      data?: ConfigSchema[]
    }>('/config/schema', { signal })
    return response.data || []
  }
}

export const systemConfigService = new SystemConfigService()
