import { ENDPOINTS } from './endpoints'
import { adminClient } from './http'
import type {
  ConfigHistoryResponse,
  ConfigItemResponse,
  ConfigUpdateRequest,
  ConfigUpdateResponse,
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
  ): Promise<ConfigItemResponse[]> {
    if (skipCache) {
      adminClient.invalidateTags(['config-all'])
    }
    const response = await adminClient.get<{
      code?: number
      data?: ConfigItemResponse[]
    }>(ENDPOINTS.CONFIG.LIST, { signal, skipCache })
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
  ): Promise<ConfigItemResponse | null> {
    if (skipCache) {
      adminClient.invalidateTags([`config:${key}`, 'config-all'])
    }
    const response = await adminClient.get<{
      code?: number
      data?: ConfigItemResponse
    }>(ENDPOINTS.CONFIG.SINGLE(key), { signal, skipCache })
    return response.data || null
  }

  /**
   * 更新配置
   */
  async update(key: string, value: string): Promise<ConfigUpdateResponse> {
    const payload: ConfigUpdateRequest = { value }
    const response = await adminClient.put<{
      code?: number
      data?: ConfigUpdateResponse
    }>(ENDPOINTS.CONFIG.SINGLE(key), payload)

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
  ): Promise<ConfigHistoryResponse[]> {
    const response = await adminClient.get<{
      code?: number
      data?: ConfigHistoryResponse[]
    }>(`${ENDPOINTS.CONFIG.HISTORY(key)}?limit=${limit}`, { signal })
    return response.data || []
  }

  /**
   * 重新加载配置
   */
  async reload(): Promise<ReloadResponse> {
    const response = await adminClient.post<{
      code?: number
      data?: ReloadResponse
    }>(ENDPOINTS.CONFIG.RELOAD, {})

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
    }>(ENDPOINTS.CONFIG.SCHEMA, { signal })
    return response.data || []
  }
}

export const systemConfigService = new SystemConfigService()
