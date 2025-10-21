<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:via-blue-400/10 dark:to-purple-400/10 rounded-xl"
      ></div>
      <div class="relative p-4">
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900 dark:from-gray-100 dark:via-indigo-300 dark:to-blue-300 bg-clip-text text-transparent"
        >
          {{ $t('links.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('links.description') }}</p>
      </div>
    </div>

    <!-- 筛选器 -->
    <LinkFilterPanel
      v-model="filterForm"
      v-model:show="showFilter"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <!-- 创建/编辑链接表单 -->
    <LinkFormPanel
      v-model="formData"
      v-model:show="showForm"
      :editing="!!editingLink"
      :editing-code="editingLink?.code"
      :loading="loading"
      @submit="handleSave"
      @cancel="collapseForm"
      @cancelEdit="cancelEdit"
    />

    <!-- 链接列表 -->
    <LinkTable
      :links="filteredLinks"
      :loading="loading"
      :error="error"
      :filtered-count="filteredLinks.length"
      :total-count="totalCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :has-active-filters="hasActiveFilters"
      :copied-link="copiedLink"
      :format-date="formatDate"
      @retry="() => fetchLinks()"
      @clear-filters="resetFilters"
      @create-new="showFormAndFocus"
      @copy="copyShortLink"
      @edit="startEdit"
      @delete="confirmDelete"
    >
      <template #pagination>
        <LinkPagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalCount"
          :total-pages="totalPages"
          :has-next="hasNext"
          :has-prev="hasPrev"
          @prev="goToPreviousPage"
          @next="goToNextPage"
          @goto="goToSpecificPage"
        />
      </template>
    </LinkTable>

    <!-- 删除确认模态框 -->
    <DeleteConfirmModal
      v-model="showDeleteModal"
      :link-code="deletingLink?.code"
      :loading="loading"
      @confirm="handleDelete"
    />

    <!-- 复制成功提示 Toast -->
    <div
      v-if="showCopyToast"
      class="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out border border-emerald-400/50 dark:border-emerald-500/50"
      :class="
        showCopyToast
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      "
    >
      <div class="flex items-start gap-3">
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-bold text-lg">{{ $t('links.linkCopied') }}</div>
          <div v-if="copiedLinkHasPassword" class="text-emerald-100 text-sm mt-1">
            {{ $t('links.passwordParameterAdded') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useLinksStore } from '@/stores/links'
import { storeToRefs } from 'pinia'
import { CheckCircleIcon } from '@/components/icons'
import type { SerializableShortLink, LinkPayload, GetLinksQuery } from '@/services/api'
import { useDateFormat } from '@/composables/useDateFormat'
import { formatDateTimeLocal, formatToRFC3339 } from '@/utils/dateFormatter'
import {
  LinkFilterPanel,
  LinkFormPanel,
  LinkTable,
  LinkPagination,
  DeleteConfirmModal,
  type FilterFormData,
} from '@/components/links'
import { config } from '@/config'

const linksStore = useLinksStore()
const { links, loading, error, totalCount, currentPage, pageSize, hasNext, hasPrev } =
  storeToRefs(linksStore)
const { fetchLinks, createLink, updateLink, deleteLink, applyFilter, resetFilter, goToPage } =
  linksStore

const { formatDate } = useDateFormat()

const showForm = ref(false)
const showFilter = ref(false)
const showDeleteModal = ref(false)
const editingLink = ref<SerializableShortLink | null>(null)
const deletingLink = ref<SerializableShortLink | null>(null)
const copiedLink = ref<string | null>(null)
const copiedLinkHasPassword = ref<boolean>(false)
const showCopyToast = ref(false)

const formData = reactive<LinkPayload>({
  code: '',
  target: '',
  expires_at: null,
  password: null,
})

const filterForm = reactive<FilterFormData>({
  search: '',
  status: '',
  page_size: 20,
  created_after: '',
  created_before: '',
})

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const hasActiveFilters = computed(() => {
  return !!(
    filterForm.search ||
    filterForm.status ||
    filterForm.created_after ||
    filterForm.created_before
  )
})

const filteredLinks = computed(() => {
  let filtered = [...links.value]

  if (filterForm.status === 'permanent') {
    filtered = filtered.filter((link) => !link.expires_at)
  } else if (filterForm.status === 'temporary') {
    filtered = filtered.filter((link) => !!link.expires_at)
  }

  return filtered
})

// 筛选相关方法
function applyFilters() {
  const query: GetLinksQuery = {
    page: 1,
    page_size: filterForm.page_size,
  }

  if (filterForm.search) {
    query.search = filterForm.search
  }

  if (filterForm.status === 'active') {
    query.only_active = true
  } else if (filterForm.status === 'expired') {
    query.only_expired = true
  }

  if (filterForm.created_after) {
    query.created_after = new Date(filterForm.created_after).toISOString()
  }

  if (filterForm.created_before) {
    const date = new Date(filterForm.created_before)
    date.setHours(23, 59, 59, 999)
    query.created_before = date.toISOString()
  }

  applyFilter(query)
}

function resetFilters() {
  filterForm.search = ''
  filterForm.status = ''
  filterForm.page_size = 20
  filterForm.created_after = ''
  filterForm.created_before = ''
  resetFilter()
}

// 分页相关方法
function goToPreviousPage() {
  if (hasPrev.value) {
    goToPage(currentPage.value - 1)
  }
}

function goToNextPage() {
  if (hasNext.value) {
    goToPage(currentPage.value + 1)
  }
}

function goToSpecificPage(page: number) {
  goToPage(page)
}

// 监听筛选表单变化
let filterTimeout: NodeJS.Timeout
watch([() => filterForm.search], () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    if (filterForm.search || hasOtherActiveFilters()) {
      applyFilters()
    }
  }, 500)
})

function hasOtherActiveFilters() {
  return !!(filterForm.status || filterForm.created_after || filterForm.created_before)
}

// 监听编辑状态
watch(editingLink, (newValue) => {
  if (newValue) {
    showForm.value = true
  }
})

// 表单相关方法
function collapseForm() {
  showForm.value = false
  if (!editingLink.value) {
    resetForm()
  }
}

function showFormAndFocus() {
  showForm.value = true
  setTimeout(() => {
    const targetInput = document.querySelector('input[type="url"]') as HTMLInputElement
    if (targetInput) {
      targetInput.focus()
    }
  }, 300)
}

function resetForm() {
  formData.code = ''
  formData.target = ''
  formData.expires_at = null
  formData.password = null
}

function startEdit(link: SerializableShortLink) {
  formData.code = link.code
  formData.target = link.target
  formData.expires_at = link.expires_at ? formatDateTimeLocal(link.expires_at) : null
  formData.password = link.password
  editingLink.value = { ...link }
  showForm.value = true

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
}

function cancelEdit() {
  editingLink.value = null
  resetForm()
}

function confirmDelete(link: SerializableShortLink) {
  deletingLink.value = link
  showDeleteModal.value = true
}

async function handleSave() {
  try {
    const payload: LinkPayload = {
      code: formData.code || undefined,
      target: formData.target,
      expires_at: formData.expires_at ? formatToRFC3339(formData.expires_at) : null,
      password: formData.password || null,
    }

    if (editingLink.value) {
      await updateLink(editingLink.value.code, payload)
      editingLink.value = null
    } else {
      await createLink(payload)
    }
    resetForm()
    showForm.value = false
  } catch (err) {
    console.error('Save failed:', err)
  }
}

async function handleDelete() {
  if (deletingLink.value) {
    try {
      await deleteLink(deletingLink.value.code)
      showDeleteModal.value = false
      deletingLink.value = null
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}

async function copyShortLink(code: string) {
  const baseUrl = config.apiBaseUrl || window.location.origin
  const link = links.value.find((l) => l.code === code)
  const hasPassword = link?.password

  const shortUrl = hasPassword
    ? `${baseUrl}/${code}?password=${link.password}`
    : `${baseUrl}/${code}`

  try {
    await navigator.clipboard.writeText(shortUrl)

    copiedLink.value = code
    copiedLinkHasPassword.value = !!hasPassword
    showCopyToast.value = true

    setTimeout(() => {
      copiedLink.value = null
      copiedLinkHasPassword.value = false
    }, 2000)

    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

onMounted(() => {
  fetchLinks()
})
</script>
