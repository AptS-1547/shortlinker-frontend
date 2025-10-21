import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // 认证状态：使用 HttpOnly Cookie，前端不存储 token
  // 通过验证 API 调用来确定认证状态
  const isAuthenticated = ref<boolean>(false)
  const isChecking = ref<boolean>(false)

  /**
   * 检查当前认证状态
   * 通过调用后端验证 API 来确定用户是否已登录
   */
  async function checkAuthStatus(): Promise<boolean> {
    isChecking.value = true
    try {
      const isValid = await AuthAPI.verifyToken()
      isAuthenticated.value = isValid
      return isValid
    } catch (error) {
      console.error('Failed to check auth status:', error)
      isAuthenticated.value = false
      return false
    } finally {
      isChecking.value = false
    }
  }

  /**
   * 登录
   * 后端会设置 HttpOnly Cookie
   */
  async function login(password: string): Promise<void> {
    try {
      await AuthAPI.login({ password })
      // 登录成功后，Cookie 已由后端设置
      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
      throw error
    }
  }

  /**
   * 登出
   * 后端会清除 HttpOnly Cookie
   */
  async function logout(): Promise<void> {
    try {
      // 调用后端登出 API 清除 Cookie
      await AuthAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // 无论成功与否，都清除本地状态
      isAuthenticated.value = false
    }
  }

  return {
    isAuthenticated,
    isChecking,
    checkAuthStatus,
    login,
    logout,
  }
})
