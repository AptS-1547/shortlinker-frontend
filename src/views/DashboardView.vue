<template>
  <div class="space-y-6 mb-8">
    <!-- 页面标题 - 现代化设计 -->
    <div class="relative mb-6">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:via-blue-400/10 dark:to-purple-400/10 rounded-xl"></div>
      <div class="relative p-4">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
          {{ $t('dashboard.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('dashboard.description') }}</p>
      </div>
    </div>

    <!-- 统计卡片 - 现代化紧凑设计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- 服务状态卡片 - 特别设计 -->
      <div
        :class="[
          'group relative p-4 rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
          healthStatus === 'healthy'
            ? 'bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 dark:from-emerald-900/20 dark:via-emerald-800/10 dark:to-teal-900/20 border-emerald-200/70 dark:border-emerald-700/50'
            : healthStatus === 'unhealthy'
            ? 'bg-gradient-to-br from-red-50 via-red-100/50 to-pink-50 dark:from-red-900/20 dark:via-red-800/10 dark:to-pink-900/20 border-red-200/70 dark:border-red-700/50'
            : 'bg-gradient-to-br from-amber-50 via-amber-100/50 to-orange-50 dark:from-amber-900/20 dark:via-amber-800/10 dark:to-orange-900/20 border-amber-200/70 dark:border-amber-700/50'
        ]"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center">
          <div
            :class="[
              'p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300',
              healthStatus === 'healthy'
                ? 'bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-800/50 dark:to-emerald-700/30'
                : healthStatus === 'unhealthy'
                ? 'bg-gradient-to-br from-red-200 to-red-100 dark:from-red-800/50 dark:to-red-700/30'
                : 'bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/50 dark:to-amber-700/30'
            ]"
          >
            <div class="flex items-center gap-1.5">
              <div
                :class="[
                  'w-2 h-2 rounded-full shadow-sm',
                  healthStatus === 'healthy'
                    ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse'
                    : healthStatus === 'unhealthy'
                    ? 'bg-red-500 dark:bg-red-400 animate-ping'
                    : 'bg-amber-500 dark:bg-amber-400 animate-pulse'
                ]"
              ></div>
              <CheckCircleIcon
                v-if="healthStatus === 'healthy'"
                className="w-4 h-4 text-emerald-700 dark:text-emerald-400"
              />
              <XCircleIcon
                v-else-if="healthStatus === 'unhealthy'"
                className="w-4 h-4 text-red-700 dark:text-red-400"
              />
              <ExclamationCircleIcon
                v-else
                className="w-4 h-4 text-amber-700 dark:text-amber-400"
              />
            </div>
          </div>
          <div class="ml-3">
            <h3
              :class="[
                'text-xs font-bold uppercase tracking-wide',
                healthStatus === 'healthy'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : healthStatus === 'unhealthy'
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-amber-800 dark:text-amber-300'
              ]"
            >
              {{ $t('dashboard.serviceStatus') }}
            </h3>
            <p
              :class="[
                'text-lg font-bold capitalize mt-0.5',
                healthStatus === 'healthy'
                  ? 'text-emerald-900 dark:text-emerald-200'
                  : healthStatus === 'unhealthy'
                  ? 'text-red-900 dark:text-red-200'
                  : 'text-amber-900 dark:text-amber-200'
              ]"
            >
              {{ $t(`layout.health.${healthStatus}`) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 其他统计卡片 - 紧凑设计 -->
      <div class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center">
          <div class="p-2 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <LinkIcon className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ $t('dashboard.totalLinks') }}</h3>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ links.length }}</p>
          </div>
        </div>
      </div>

      <div class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center">
          <div class="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <CheckCircleIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ $t('dashboard.activeLinks') }}</h3>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ activeLinks }}</p>
          </div>
        </div>
      </div>

      <div class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-center">
          <div class="p-2 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <ClockIcon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ $t('dashboard.responseTime') }}</h3>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ responseTime }}ms</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近的链接 - 现代化紧凑设计 -->
    <div class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl"></div>
      <div class="relative">
        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-gray-100 dark:to-indigo-300 bg-clip-text text-transparent">
          {{ $t('dashboard.recentLinks') }}
        </h2>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin mx-auto mb-4">
            <SpinnerIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>

        <div v-else-if="recentLinks.length === 0" class="text-center py-8">
          <div class="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-sm">
            <LinkIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{{ $t('dashboard.noLinks') }}</h3>
          <p class="text-gray-700 dark:text-gray-400 mb-4">{{ $t('dashboard.noLinksDesc') }}</p>
          <router-link
            to="/links"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {{ $t('dashboard.createLink') }}
          </router-link>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="link in recentLinks"
            :key="link.code"
            class="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/40 dark:from-gray-700/50 dark:to-gray-600/30 rounded-lg hover:from-indigo-50/80 hover:to-purple-50/40 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-200/70 dark:hover:border-indigo-700/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <button
                @click="copyShortLink(link.code)"
                :class="[
                  'font-mono text-sm px-3 py-1.5 rounded-lg transition-all duration-300 border shadow-sm hover:shadow-md relative',
                  copiedLink === link.code
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 scale-105 shadow-md'
                    : link.password
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:from-amber-200 hover:to-amber-100 dark:hover:from-amber-800/40 dark:hover:to-amber-700/30 group-hover:scale-105'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-600 dark:to-gray-500 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-500 hover:from-indigo-100 hover:to-indigo-50 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/20 hover:text-indigo-800 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 group-hover:scale-105'
                ]"
                :title="copiedLink === link.code ? $t('common.copied') : link.password ? $t('links.copyPasswordProtectedLink') : $t('links.copyLinkTitle')"
              >
                <div class="flex items-center gap-1.5">
                  <span class="font-bold">{{ link.code }}</span>
                  <!-- 密码保护标识 -->
                  <span v-if="link.password" class="text-xs" :title="$t('links.passwordProtected')">🔒</span>
                  <CheckCircleIcon
                    v-if="copiedLink === link.code"
                    className="w-3 h-3 text-emerald-700 dark:text-emerald-400"
                  />
                  <CopyIcon
                    v-else
                    className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </button>
              <span class="text-gray-400 dark:text-gray-500 text-sm">→</span>
              <span class="text-gray-700 dark:text-gray-300 truncate font-medium text-sm">
                {{ link.target }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 font-medium bg-gray-100/80 dark:bg-gray-600/50 px-2 py-1 rounded">
                {{ formatDate(link.created_at) }}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-200/70 dark:border-gray-600/50">
            <router-link
              to="/links"
              class="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-all duration-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded"
            >
              {{ $t('dashboard.viewAllLinks') }}
              <ChevronRightIcon className="w-3 h-3 ml-1" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统健康状态 - 现代化紧凑设计 -->
    <div class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div class="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-indigo-50/30 dark:from-green-900/10 dark:via-blue-900/10 dark:to-indigo-900/10 rounded-xl"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
            {{ $t('dashboard.systemHealth') }}
          </h2>
          <button
            @click="refreshHealth"
            :disabled="healthLoading"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <RefreshIcon
              :class="['w-3 h-3 mr-1.5', { 'animate-spin': healthLoading }]"
            />
            {{ $t('common.refresh') }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="group relative p-3 bg-gradient-to-r from-indigo-50/80 to-indigo-100/40 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border border-indigo-200/50 dark:border-indigo-700/30 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-indigo-50/10 dark:from-indigo-900/10 dark:to-indigo-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-center gap-2 mb-1">
              <div class="p-1 bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-800/50 dark:to-indigo-700/30 rounded shadow-sm">
                <DatabaseIcon className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
              </div>
              <span class="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">{{ $t('dashboard.storage') }}</span>
            </div>
            <p class="text-base font-bold text-indigo-900 dark:text-indigo-200 ml-6">{{ storageType }}</p>
          </div>

          <div class="group relative p-3 bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:from-amber-900/20 dark:to-amber-800/10 rounded-lg border border-amber-200/50 dark:border-amber-700/30 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-amber-50/10 dark:from-amber-900/10 dark:to-amber-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-center gap-2 mb-1">
              <div class="p-1 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/50 dark:to-amber-700/30 rounded shadow-sm">
                <ClockIcon className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              </div>
              <span class="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">{{ $t('dashboard.lastCheck') }}</span>
            </div>
            <p class="text-sm font-bold text-amber-900 dark:text-amber-200 ml-6">{{ lastHealthCheck }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 Toast - 现代化设计 -->
    <div
      v-if="showCopyToast"
      class="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white px-4 py-2.5 rounded-lg shadow-xl transform transition-all duration-300 ease-out border border-emerald-400/50 dark:border-emerald-500/50"
      :class="showCopyToast ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'"
    >
      <div class="flex items-center gap-2">
        <CheckCircleIcon className="w-4 h-4" />
        <span class="font-medium text-sm">
          {{ copiedLinkHasPassword ? $t('links.passwordParameterAdded') : $t('links.linkCopied') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLinksStore } from '@/stores/links'
import { useHealthStore } from '@/stores/health'
import { storeToRefs } from 'pinia'
import { HealthAPI } from '@/services/api'
import { LinkIcon, CheckCircleIcon, ClockIcon, SpinnerIcon, PlusIcon, CopyIcon, ChevronRightIcon, RefreshIcon, DatabaseIcon, XCircleIcon, ExclamationCircleIcon } from '@/components/icons'
import { useI18n } from 'vue-i18n'

const linksStore = useLinksStore()
const healthStore = useHealthStore()
const { links, loading } = storeToRefs(linksStore)
const { status: healthData } = storeToRefs(healthStore)
const { fetchLinks } = linksStore
const { checkHealth } = healthStore
const { t } = useI18n()

const healthLoading = ref(false)
const copiedLink = ref<string | null>(null)
const copiedLinkHasPassword = ref(false)
const showCopyToast = ref(false)

const activeLinks = computed(() => {
  const now = new Date()
  return links.value.filter((link) => !link.expires_at || new Date(link.expires_at) > now).length
})

const recentLinks = computed(() => {
  return [...links.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const responseTime = computed(() => {
  return (healthData.value as any)?.response_time_ms || 0
})

const formattedUptime = computed(() => {
  const uptime = (healthData.value as any)?.uptime || 0
  const hours = Math.floor(uptime / 3600)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h`
})

const healthStatus = computed(() => {
  return healthData.value?.status || 'unknown'
})

const storageType = computed(() => {
  const checks = (healthData.value as any)?.checks
  return checks?.storage?.backend?.storage_type || 'Unknown'
})

const lastHealthCheck = computed(() => {
  const timestamp = healthData.value?.timestamp
  if (!timestamp) return t('dashboard.never')

  try {
    return new Date(timestamp as string | number | Date).toLocaleTimeString('zh-CN')
  } catch {
    return t('dashboard.never')
  }
})

function formatDate(dateString: string) {
  // 确保正确解析 RFC3339 格式的时间
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function copyShortLink(code: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin

  // 查找对应的链接以检查是否有密码保护
  const link = links.value.find(l => l.code === code)
  const hasPassword = link?.password

  // 如果有密码保护，添加 ?password=实际密码 参数
  const shortUrl = hasPassword
    ? `${baseUrl}/${code}?password=${link.password}`
    : `${baseUrl}/${code}`

  try {
    await navigator.clipboard.writeText(shortUrl)

    // 设置当前复制的链接和密码状态
    copiedLink.value = code
    copiedLinkHasPassword.value = !!hasPassword
    showCopyToast.value = true

    // 2秒后重置状态
    setTimeout(() => {
      copiedLink.value = null
      copiedLinkHasPassword.value = false
    }, 2000)

    // 3秒后隐藏 Toast
    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)

    console.log('Link copied to clipboard:', shortUrl)
  } catch (err) {
    console.error('Failed to copy link:', err)
    // 可以添加错误提示
  }
}

async function refreshHealth() {
  healthLoading.value = true
  try {
    await checkHealth()
  } catch (error) {
    console.error('Failed to refresh health:', error)
  } finally {
    healthLoading.value = false
  }
}

onMounted(() => {
  fetchLinks()
  checkHealth()
})
</script>
