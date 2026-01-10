import { adminClient } from './http'
import type {
  SystemConfigHistory,
  SystemConfigItem,
  SystemConfigUpdateRequest,
  SystemConfigUpdateResponse,
} from './types'

export class SystemConfigService {
  /**
   * 获取所有配置
   */
  async fetchAll(): Promise<SystemConfigItem[]> {
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigItem[]
    }>('/config')
    return response.data || []
  }

  /**
   * 获取单个配置
   */
  async fetchOne(key: string): Promise<SystemConfigItem | null> {
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigItem
    }>(`/config/${encodeURIComponent(key)}`)
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
    return (
      response.data || {
        key,
        value,
        requires_restart: false,
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
  ): Promise<SystemConfigHistory[]> {
    const response = await adminClient.get<{
      code?: number
      data?: SystemConfigHistory[]
    }>(`/config/${encodeURIComponent(key)}/history?limit=${limit}`)
    return response.data || []
  }

  /**
   * 重新加载配置
   */
  async reload(): Promise<void> {
    await adminClient.post<{ code?: number; data?: { message: string } }>(
      '/config/reload',
      {},
    )
  }
}

export const systemConfigService = new SystemConfigService()
