import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LinkAPI } from '@/services/api'
import { extractErrorMessage } from '@/utils/errorHandler'
import type { SerializableShortLink, LinkPayload, GetLinksQuery } from '@/services/api'

interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export const useLinksStore = defineStore('links', () => {
  // 链接数据
  const links = ref<SerializableShortLink[]>([])

  // 加载状态（分离不同操作）
  const fetching = ref(false)
  const creating = ref(false)
  const updating = ref(false)
  const deleting = ref(false)

  // 错误状态
  const error = ref<string | null>(null)

  // 分页状态（整合为单一对象）
  const pagination = ref<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // 当前查询条件
  const currentQuery = ref<GetLinksQuery>({})

  // Getters
  const loading = computed(
    () => fetching.value || creating.value || updating.value || deleting.value,
  )

  async function createNewLink(data: LinkPayload) {
    creating.value = true
    error.value = null
    try {
      await LinkAPI.create(data)
      // 重新获取数据以确保同步
      await fetchLinks(currentQuery.value)
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to create link')
      throw err
    } finally {
      creating.value = false
    }
  }

  async function updateExistingLink(code: string, data: LinkPayload) {
    updating.value = true
    error.value = null
    try {
      await LinkAPI.update(code, data)
      // 重新获取数据以确保同步
      await fetchLinks(currentQuery.value)
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to update link')
      throw err
    } finally {
      updating.value = false
    }
  }

  async function deleteExistingLink(code: string) {
    deleting.value = true
    error.value = null
    try {
      await LinkAPI.delete(code)
      // 从本地数组中移除
      links.value = links.value.filter((link) => link.code !== code)
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - 1)
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to delete link')
      throw err
    } finally {
      deleting.value = false
    }
  }

  async function fetchLinks(query?: GetLinksQuery) {
    fetching.value = true
    error.value = null

    try {
      if (query) {
        currentQuery.value = { ...query }
      }

      const response = await LinkAPI.fetchPaginated(query || currentQuery.value)

      // 处理API响应格式: { data, pagination }
      if (response && response.data && response.pagination) {
        // 安全地提取链接数据
        const linksData = response.data || []
        links.value = Array.isArray(linksData) ? linksData : []

        // 更新分页信息
        pagination.value = {
          page: response.pagination.page || 1,
          pageSize: response.pagination.page_size || 10,
          total: response.pagination.total || 0,
          totalPages: response.pagination.total_pages || 0,
          hasNext: response.pagination.page < response.pagination.total_pages,
          hasPrev: response.pagination.page > 1,
        }
      } else {
        // 如果响应格式不正确，重置数据
        resetPagination()
        console.warn('Unexpected API response format:', response)
      }
    } catch (err) {
      error.value = extractErrorMessage(err, 'Failed to fetch links')
      console.error('Failed to fetch links:', err)

      // 在错误情况下重置数据
      resetPagination()
    } finally {
      fetching.value = false
    }
  }

  // 应用筛选
  async function applyFilter(query: GetLinksQuery) {
    currentQuery.value = { ...query, page: 1 }
    await fetchLinks(currentQuery.value)
  }

  // 重置筛选
  async function resetFilter() {
    currentQuery.value = {}
    pagination.value.page = 1
    await fetchLinks()
  }

  // 分页
  async function goToPage(page: number) {
    currentQuery.value.page = page
    pagination.value.page = page
    await fetchLinks(currentQuery.value)
  }

  // 重置分页状态的辅助函数
  function resetPagination() {
    links.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    }
  }

  return {
    // 状态
    links,
    fetching,
    creating,
    updating,
    deleting,
    loading,
    error,
    pagination,
    currentQuery,

    // 方法
    fetchLinks,
    applyFilter,
    resetFilter,
    goToPage,
    createLink: createNewLink,
    updateLink: updateExistingLink,
    deleteLink: deleteExistingLink,
  }
})
