import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock SystemConfigAPI
vi.mock('@/services/api', () => ({
  SystemConfigAPI: {
    fetchAll: vi.fn(),
    update: vi.fn(),
    reload: vi.fn(),
  },
}))

// Mock errorHandler
vi.mock('@/utils/errorHandler', () => ({
  extractErrorMessage: vi.fn((err, defaultMsg) =>
    err instanceof Error ? err.message : defaultMsg,
  ),
}))

import { useSystemConfigStore, useSystemConfigLoading } from '../systemConfigStore'
import { SystemConfigAPI } from '@/services/api'

describe('systemConfigStore', () => {
  const mockConfig = {
    key: 'test_key',
    value: 'test_value',
    updated_at: '2024-01-01T00:00:00Z',
  }

  const mockConfigs = [
    mockConfig,
    { key: 'another_key', value: 'another_value', updated_at: '2024-01-01T00:00:00Z' },
  ]

  beforeEach(() => {
    // Reset store state
    useSystemConfigStore.setState({
      configs: [],
      fetching: false,
      updating: false,
      reloading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Initial state
  // ==========================================================================

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useSystemConfigStore.getState()
      expect(state.configs).toEqual([])
      expect(state.fetching).toBe(false)
      expect(state.updating).toBe(false)
      expect(state.reloading).toBe(false)
      expect(state.error).toBe(null)
    })
  })

  // ==========================================================================
  // fetchConfigs
  // ==========================================================================

  describe('fetchConfigs', () => {
    it('should fetch configs and update state', async () => {
      vi.mocked(SystemConfigAPI.fetchAll).mockResolvedValueOnce(mockConfigs)

      await act(async () => {
        await useSystemConfigStore.getState().fetchConfigs()
      })

      const state = useSystemConfigStore.getState()
      expect(state.configs).toEqual(mockConfigs)
      expect(state.fetching).toBe(false)
    })

    it('should set fetching to true during fetch', async () => {
      let fetchingDuringCall = false
      vi.mocked(SystemConfigAPI.fetchAll).mockImplementation(async () => {
        fetchingDuringCall = useSystemConfigStore.getState().fetching
        return mockConfigs
      })

      await act(async () => {
        await useSystemConfigStore.getState().fetchConfigs()
      })

      expect(fetchingDuringCall).toBe(true)
    })

    it('should handle fetch error', async () => {
      vi.mocked(SystemConfigAPI.fetchAll).mockRejectedValueOnce(
        new Error('Network error'),
      )

      await expect(
        act(async () => {
          await useSystemConfigStore.getState().fetchConfigs()
        }),
      ).rejects.toThrow('Network error')

      const state = useSystemConfigStore.getState()
      expect(state.error).toBe('Network error')
    })

    it('should ignore AbortError', async () => {
      const abortError = new Error('Aborted')
      abortError.name = 'AbortError'
      vi.mocked(SystemConfigAPI.fetchAll).mockRejectedValueOnce(abortError)

      // Should not throw
      await act(async () => {
        await useSystemConfigStore.getState().fetchConfigs()
      })

      const state = useSystemConfigStore.getState()
      expect(state.error).toBe(null)
    })

    it('should pass signal to API', async () => {
      vi.mocked(SystemConfigAPI.fetchAll).mockResolvedValueOnce(mockConfigs)
      const controller = new AbortController()

      await act(async () => {
        await useSystemConfigStore.getState().fetchConfigs(controller.signal)
      })

      expect(SystemConfigAPI.fetchAll).toHaveBeenCalledWith(
        controller.signal,
        true,
      )
    })
  })

  // ==========================================================================
  // updateConfig
  // ==========================================================================

  describe('updateConfig', () => {
    it('should update config optimistically and return result', async () => {
      useSystemConfigStore.setState({ configs: mockConfigs })
      vi.mocked(SystemConfigAPI.update).mockResolvedValueOnce({
        requires_restart: false,
        message: null,
      })

      const result = await act(async () => {
        return await useSystemConfigStore.getState().updateConfig('test_key', 'new_value')
      })

      expect(result).toEqual({ requires_restart: false, message: null })
      const state = useSystemConfigStore.getState()
      const updatedConfig = state.configs.find((c) => c.key === 'test_key')
      expect(updatedConfig?.value).toBe('new_value')
    })

    it('should set updating to true during update', async () => {
      useSystemConfigStore.setState({ configs: mockConfigs })
      let updatingDuringCall = false
      vi.mocked(SystemConfigAPI.update).mockImplementation(async () => {
        updatingDuringCall = useSystemConfigStore.getState().updating
        return { requires_restart: false, message: null }
      })

      await act(async () => {
        await useSystemConfigStore.getState().updateConfig('test_key', 'new_value')
      })

      expect(updatingDuringCall).toBe(true)
    })

    it('should rollback on error', async () => {
      useSystemConfigStore.setState({ configs: mockConfigs })
      vi.mocked(SystemConfigAPI.update).mockRejectedValueOnce(
        new Error('Update failed'),
      )

      await expect(
        act(async () => {
          await useSystemConfigStore.getState().updateConfig('test_key', 'new_value')
        }),
      ).rejects.toThrow('Update failed')

      const state = useSystemConfigStore.getState()
      const config = state.configs.find((c) => c.key === 'test_key')
      expect(config?.value).toBe('test_value') // Should be rolled back
      expect(state.error).toBe('Update failed')
    })

    it('should return requires_restart flag', async () => {
      useSystemConfigStore.setState({ configs: mockConfigs })
      vi.mocked(SystemConfigAPI.update).mockResolvedValueOnce({
        requires_restart: true,
        message: 'Please restart the server',
      })

      const result = await act(async () => {
        return await useSystemConfigStore.getState().updateConfig('test_key', 'new_value')
      })

      expect(result.requires_restart).toBe(true)
      expect(result.message).toBe('Please restart the server')
    })
  })

  // ==========================================================================
  // reloadConfigs
  // ==========================================================================

  describe('reloadConfigs', () => {
    it('should reload configs and refetch', async () => {
      vi.mocked(SystemConfigAPI.reload).mockResolvedValueOnce(undefined)
      vi.mocked(SystemConfigAPI.fetchAll).mockResolvedValueOnce(mockConfigs)

      await act(async () => {
        await useSystemConfigStore.getState().reloadConfigs()
      })

      expect(SystemConfigAPI.reload).toHaveBeenCalled()
      expect(SystemConfigAPI.fetchAll).toHaveBeenCalled()
      const state = useSystemConfigStore.getState()
      expect(state.configs).toEqual(mockConfigs)
    })

    it('should set reloading to true during reload', async () => {
      let reloadingDuringCall = false
      vi.mocked(SystemConfigAPI.reload).mockImplementation(async () => {
        reloadingDuringCall = useSystemConfigStore.getState().reloading
        return undefined
      })
      vi.mocked(SystemConfigAPI.fetchAll).mockResolvedValueOnce(mockConfigs)

      await act(async () => {
        await useSystemConfigStore.getState().reloadConfigs()
      })

      expect(reloadingDuringCall).toBe(true)
    })

    it('should handle reload error', async () => {
      vi.mocked(SystemConfigAPI.reload).mockRejectedValueOnce(
        new Error('Reload failed'),
      )

      await expect(
        act(async () => {
          await useSystemConfigStore.getState().reloadConfigs()
        }),
      ).rejects.toThrow('Reload failed')

      const state = useSystemConfigStore.getState()
      expect(state.error).toBe('Reload failed')
    })
  })

  // ==========================================================================
  // Selectors
  // ==========================================================================

  describe('selectors', () => {
    it('loading selector should return true when fetching', () => {
      useSystemConfigStore.setState({ fetching: true })
      const state = useSystemConfigStore.getState()
      const isLoading = state.fetching || state.updating || state.reloading
      expect(isLoading).toBe(true)
    })

    it('loading selector should return true when updating', () => {
      useSystemConfigStore.setState({ updating: true })
      const state = useSystemConfigStore.getState()
      const isLoading = state.fetching || state.updating || state.reloading
      expect(isLoading).toBe(true)
    })

    it('loading selector should return true when reloading', () => {
      useSystemConfigStore.setState({ reloading: true })
      const state = useSystemConfigStore.getState()
      const isLoading = state.fetching || state.updating || state.reloading
      expect(isLoading).toBe(true)
    })

    it('loading selector should return false when no loading state', () => {
      const state = useSystemConfigStore.getState()
      const isLoading = state.fetching || state.updating || state.reloading
      expect(isLoading).toBe(false)
    })
  })
})
