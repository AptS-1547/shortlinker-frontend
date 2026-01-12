import { adminClient } from './http'
import type {
  BatchCreateRequest,
  BatchDeleteRequest,
  BatchOperationResult,
  BatchUpdateRequest,
  LinkPayload,
} from './types'

interface ApiResponse<T> {
  code: number
  data: T
}

export class BatchService {
  /**
   * 批量创建链接
   */
  async createLinks(links: LinkPayload[]): Promise<BatchOperationResult> {
    const response = await adminClient.post<ApiResponse<BatchOperationResult>>(
      '/links/batch',
      { links } satisfies BatchCreateRequest,
    )
    return response.data
  }

  /**
   * 批量更新链接
   */
  async updateLinks(
    updates: { code: string; payload: LinkPayload }[],
  ): Promise<BatchOperationResult> {
    const response = await adminClient.put<ApiResponse<BatchOperationResult>>(
      '/links/batch',
      { updates } satisfies BatchUpdateRequest,
    )
    return response.data
  }

  /**
   * 批量删除链接
   */
  async deleteLinks(codes: string[]): Promise<BatchOperationResult> {
    const response = await adminClient.delete<
      ApiResponse<BatchOperationResult>
    >('/links/batch', { codes } satisfies BatchDeleteRequest)
    return response.data
  }
}

export const batchService = new BatchService()
