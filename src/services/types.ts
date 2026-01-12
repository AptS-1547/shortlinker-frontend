export interface SerializableShortLink {
  code: string
  target: string
  /** RFC3339 格式的创建时间 */
  created_at: string
  /** RFC3339 格式的过期时间，null 表示永不过期 */
  expires_at: string | null
  /** 密码保护 */
  password: string | null
  /** 点击次数 */
  click_count: number
}

export interface LinkPayload {
  code?: string
  target: string
  /** RFC3339 格式的过期时间，例如: 2023-12-31T23:59:59Z */
  expires_at?: string | null
  /** 密码保护 */
  password?: string | null
  force?: boolean
}

export interface AuthRequest {
  password: string
}

export interface AuthResponse {
  token: string
  expires_in?: number
}

export interface HealthStorageBackend {
  storage_type: string
  support_click: boolean
}

export interface HealthStorageCheck {
  status: string
  links_count: number
  backend: HealthStorageBackend
}

export interface HealthChecks {
  storage: HealthStorageCheck
}

export interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
  response_time_ms: number
  checks: HealthChecks
}

export interface BatchOperationResult {
  success: string[]
  failed: { code: string; error: string }[]
}

export interface QRCodeOptions {
  size?: number
  margin?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export interface LinkCreateResult {
  success: boolean
  exists?: boolean
  existingLink?: SerializableShortLink
}

export interface GetLinksQuery {
  page?: number
  page_size?: number
  created_after?: string
  created_before?: string
  only_expired?: boolean
  only_active?: boolean
  search?: string // 如果后端支持搜索功能的话
}

// 新的API响应格式
export interface PaginatedLinksResponse {
  code: number
  data: SerializableShortLink[] // 改为数组格式
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

// 链接统计信息
export interface LinkStats {
  total_links: number
  total_clicks: number
  active_links: number
}

// ============ 系统配置管理相关类型 ============

/** 系统配置项 */
export interface SystemConfigItem {
  key: string
  value: string
  value_type: 'string' | 'int' | 'bool' | 'json'
  requires_restart: boolean
  is_sensitive: boolean
  updated_at: string
}

/** 系统配置更新请求 */
export interface SystemConfigUpdateRequest {
  value: string
}

/** 系统配置更新响应 */
export interface SystemConfigUpdateResponse {
  key: string
  value: string
  requires_restart: boolean
  is_sensitive: boolean
  message: string | null
}

/** 系统配置历史记录 */
export interface SystemConfigHistory {
  id: number
  config_key: string
  old_value: string | null
  new_value: string
  changed_at: string
  changed_by: string | null
}
