import { ref, computed } from 'vue'

export interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
  total?: number
}

/**
 * 分页逻辑的 Composable
 */
export function usePagination(options: PaginationOptions = {}) {
  const currentPage = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 20)
  const total = ref(options.total || 0)

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  const hasNext = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPrev = computed(() => {
    return currentPage.value > 1
  })

  const startIndex = computed(() => {
    return (currentPage.value - 1) * pageSize.value + 1
  })

  const endIndex = computed(() => {
    return Math.min(currentPage.value * pageSize.value, total.value)
  })

  /**
   * 计算可见的页码列表
   * @param delta - 当前页两侧显示的页数
   */
  const visiblePages = computed(() => {
    return (delta: number = 2) => {
      const totalPagesValue = totalPages.value
      const current = currentPage.value

      let start = Math.max(1, current - delta)
      let end = Math.min(totalPagesValue, current + delta)

      // 确保至少显示 5 个页码（如果可能）
      const minVisible = Math.min(5, totalPagesValue)
      if (end - start + 1 < minVisible) {
        if (start === 1) {
          end = Math.min(totalPagesValue, start + minVisible - 1)
        } else if (end === totalPagesValue) {
          start = Math.max(1, end - minVisible + 1)
        }
      }

      const pages: number[] = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  })

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    if (hasNext.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (hasPrev.value) {
      currentPage.value--
    }
  }

  function setPageSize(size: number) {
    pageSize.value = size
    // 重新计算当前页，确保不超出范围
    const maxPage = Math.ceil(total.value / size)
    if (currentPage.value > maxPage) {
      currentPage.value = Math.max(1, maxPage)
    }
  }

  function setTotal(value: number) {
    total.value = value
  }

  function reset() {
    currentPage.value = options.initialPage || 1
    pageSize.value = options.initialPageSize || 20
    total.value = options.total || 0
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    visiblePages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setTotal,
    reset,
  }
}
