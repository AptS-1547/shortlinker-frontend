import { useCallback, useEffect, useRef, useState } from 'react'

export type StatusFilter = 'all' | 'active' | 'expired'

export interface LinksFilterState {
  searchQuery: string
  statusFilter: StatusFilter
  createdAfter: Date | undefined
  createdBefore: Date | undefined
}

export interface LinksFilterQuery {
  search?: string
  only_active?: boolean
  only_expired?: boolean
  created_after?: string
  created_before?: string
  page?: number
}

interface UseLinksFiltersOptions {
  onFilterChange: (query: LinksFilterQuery) => void
  debounceMs?: number
}

export function useLinksFilters({
  onFilterChange,
  debounceMs = 300,
}: UseLinksFiltersOptions) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [createdAfter, setCreatedAfter] = useState<Date | undefined>(undefined)
  const [createdBefore, setCreatedBefore] = useState<Date | undefined>(
    undefined,
  )

  const hasFetched = useRef(false)
  const prevFilter = useRef({
    searchQuery,
    statusFilter,
    createdAfter,
    createdBefore,
  })

  const buildQuery = useCallback((): LinksFilterQuery => {
    return {
      search: searchQuery || undefined,
      only_active: statusFilter === 'active' ? true : undefined,
      only_expired: statusFilter === 'expired' ? true : undefined,
      created_after: createdAfter?.toISOString(),
      created_before: createdBefore?.toISOString(),
      page: 1,
    }
  }, [searchQuery, statusFilter, createdAfter, createdBefore])

  // biome-ignore lint/correctness/useExhaustiveDependencies: 仅监听筛选变化
  useEffect(() => {
    const query = buildQuery()

    // 首次请求
    if (!hasFetched.current) {
      hasFetched.current = true
      prevFilter.current = {
        searchQuery,
        statusFilter,
        createdAfter,
        createdBefore,
      }
      onFilterChange(query)
      return
    }

    // 检查筛选是否真正变化
    const filterChanged =
      prevFilter.current.searchQuery !== searchQuery ||
      prevFilter.current.statusFilter !== statusFilter ||
      prevFilter.current.createdAfter !== createdAfter ||
      prevFilter.current.createdBefore !== createdBefore

    if (!filterChanged) return

    // 筛选变化，防抖
    prevFilter.current = {
      searchQuery,
      statusFilter,
      createdAfter,
      createdBefore,
    }
    const timer = setTimeout(() => {
      onFilterChange(query)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, createdAfter, createdBefore])

  const clearDateFilters = useCallback(() => {
    setCreatedAfter(undefined)
    setCreatedBefore(undefined)
  }, [])

  return {
    // State
    searchQuery,
    statusFilter,
    createdAfter,
    createdBefore,
    // Setters
    setSearchQuery,
    setStatusFilter,
    setCreatedAfter,
    setCreatedBefore,
    clearDateFilters,
    // Helpers
    buildQuery,
  }
}
