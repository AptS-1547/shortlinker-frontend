import { create } from 'zustand'
import { HealthAPI, type HealthResponse } from '@/services/api'

// 缓存有效期 30 秒
const CACHE_TTL = 30 * 1000

interface HealthState {
  status: HealthResponse | null
  loading: boolean
  lastFetchTime: number | null
  error: string | null
  checkHealth: (force?: boolean) => Promise<void>
}

export const useHealthStore = create<HealthState>((set, get) => ({
  status: null,
  loading: false,
  lastFetchTime: null,
  error: null,

  checkHealth: async (force = false) => {
    const { lastFetchTime, loading } = get()
    const now = Date.now()

    // 如果正在加载，跳过
    if (loading) return

    // 如果缓存有效且非强制刷新，跳过
    if (!force && lastFetchTime && now - lastFetchTime < CACHE_TTL) {
      return
    }

    set({ loading: true, error: null })
    try {
      const status = await HealthAPI.check()
      set({ status, lastFetchTime: now })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Health check failed',
        status: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
        },
      })
    } finally {
      set({ loading: false })
    }
  },
}))
