// ============ 从生成文件重新导出（保持原有名称兼容） ============
// 健康检查类型
// 直接导出的新类型
export type {
  BatchCreateRequest,
  BatchDeleteRequest,
  BatchFailedItem,
  BatchResponse as BatchOperationResult,
  BatchUpdateItem,
  BatchUpdateRequest,
  ConfigHistoryResponse as SystemConfigHistory,
  ConfigItemResponse as SystemConfigItem,
  ConfigUpdateRequest as SystemConfigUpdateRequest,
  ConfigUpdateResponse as SystemConfigUpdateResponse,
  GetLinksQuery,
  HealthChecks,
  HealthResponse,
  HealthStorageBackend,
  HealthStorageCheck,
  ImportFailedItem,
  ImportMode,
  ImportResponse,
  LinkResponse as SerializableShortLink,
  LoginCredentials as AuthRequest,
  PaginationInfo,
  PostNewLink as LinkPayload,
  StatsResponse as LinkStats,
  ValueType,
} from './types.generated'

// ============ 前端专用类型（保留） ============

export interface AuthResponse {
  token: string
  expires_in?: number
}

export interface QRCodeOptions {
  size?: number
  margin?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export interface LinkCreateResult {
  success: boolean
  exists?: boolean
  existingLink?: import('./types.generated').LinkResponse
}

// 分页响应包装（组合 PaginationInfo）
export interface PaginatedLinksResponse {
  code: number
  data: import('./types.generated').LinkResponse[]
  pagination: import('./types.generated').PaginationInfo
}
