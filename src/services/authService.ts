import { adminClient } from './http'
import type { AuthRequest } from './types'

export class AuthService {
  /**
   * 用户登录
   * 后端会设置 HttpOnly Cookie，不返回 token
   */
  async login(credentials: AuthRequest): Promise<void> {
    await adminClient.post('/auth/login', credentials)
    // 成功后，Cookie 已由后端通过 Set-Cookie 响应头设置
    // 前端不需要存储任何 token
  }

  /**
   * 用户登出
   * 后端会清除 HttpOnly Cookie
   */
  async logout(): Promise<void> {
    try {
      await adminClient.post('/auth/logout', {})
    } catch (error) {
      console.error('Logout API failed:', error)
      // 即使 API 失败，也应该让前端认为已登出
      throw error
    }
  }

  /**
   * 验证 Token（通过 Cookie）
   * 返回是否已认证
   */
  async verifyToken(): Promise<boolean> {
    try {
      await adminClient.get('/auth/verify')
      return true
    } catch {
      // 401 或其他错误都视为未认证
      return false
    }
  }
}

export const authService = new AuthService()
