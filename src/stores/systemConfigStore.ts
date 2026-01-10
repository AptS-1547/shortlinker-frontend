import { create } from 'zustand'
import { SystemConfigAPI } from '@/services/api'
import type { SystemConfigItem } from '@/services/types'
import { extractErrorMessage } from '@/utils/errorHandler'

interface SystemConfigState {
  configs: SystemConfigItem[]
  fetching: boolean
  updating: boolean
  reloading: boolean
  error: string | null

  // Actions
  fetchConfigs: () => Promise<void>
  updateConfig: (
    key: string,
    value: string,
  ) => Promise<{ requires_restart: boolean; message: string | null }>
  reloadConfigs: () => Promise<void>
}

export const useSystemConfigStore = create<SystemConfigState>((set, get) => ({
  configs: [],
  fetching: false,
  updating: false,
  reloading: false,
  error: null,

  fetchConfigs: async () => {
    set({ fetching: true, error: null })
    try {
      const configs = await SystemConfigAPI.fetchAll()
      set({ configs })
    } catch (err) {
      set({ error: extractErrorMessage(err, 'Failed to fetch configs') })
      throw err
    } finally {
      set({ fetching: false })
    }
  },

  updateConfig: async (key: string, value: string) => {
    set({ updating: true, error: null })
    try {
      const result = await SystemConfigAPI.update(key, value)

      // 更新本地状态
      const configs = get().configs.map((config) =>
        config.key === key
          ? { ...config, value, updated_at: new Date().toISOString() }
          : config,
      )
      set({ configs })

      return {
        requires_restart: result.requires_restart,
        message: result.message,
      }
    } catch (err) {
      set({ error: extractErrorMessage(err, 'Failed to update config') })
      throw err
    } finally {
      set({ updating: false })
    }
  },

  reloadConfigs: async () => {
    set({ reloading: true, error: null })
    try {
      await SystemConfigAPI.reload()
      // 重新获取配置
      await get().fetchConfigs()
    } catch (err) {
      set({ error: extractErrorMessage(err, 'Failed to reload configs') })
      throw err
    } finally {
      set({ reloading: false })
    }
  },
}))

// Selector for loading state
export const useSystemConfigLoading = () =>
  useSystemConfigStore(
    (state) => state.fetching || state.updating || state.reloading,
  )
