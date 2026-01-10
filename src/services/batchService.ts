import { adminClient } from './http'
import type { BatchOperationResult, LinkPayload } from './types'

interface BatchCreateRequest {
  links: LinkPayload[]
}

interface BatchUpdateRequest {
  updates: { code: string; payload: LinkPayload }[]
}

interface BatchDeleteRequest {
  codes: string[]
}

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
      '/link/batch',
      { links } as BatchCreateRequest,
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
      '/link/batch',
      { updates } as BatchUpdateRequest,
    )
    return response.data
  }

  /**
   * 批量删除链接
   */
  async deleteLinks(codes: string[]): Promise<BatchOperationResult> {
    const response = await adminClient.delete<
      ApiResponse<BatchOperationResult>
    >('/link/batch', { codes } as BatchDeleteRequest)
    return response.data
  }
}

export const batchService = new BatchService()
