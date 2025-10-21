<template>
  <div class="space-y-6 mb-8">
    <!-- 页面标题 -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:via-blue-400/10 dark:to-purple-400/10 rounded-xl"
      ></div>
      <div class="relative p-4">
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent"
        >
          {{ $t('dashboard.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('dashboard.description') }}</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <StatisticsCards
      :health-status="healthStatus"
      :total-links="links.length"
      :active-links="activeLinks"
      :response-time="responseTime"
    />

    <!-- 最近的链接 -->
    <RecentLinksSection
      :links="recentLinks"
      :loading="loading"
      :copied-link="copiedLink"
      :format-date="formatDateTime"
      @copy="copyShortLink"
    />

    <!-- 系统健康状态 -->
    <SystemHealthPanel
      :storage-type="storageType"
      :last-check="lastHealthCheck"
      :loading="healthLoading"
      @refresh="refreshHealth"
    />

    <!-- 复制成功提示 Toast -->
    <div
      v-if="showCopyToast"
      class="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white px-4 py-2.5 rounded-lg shadow-xl transform transition-all duration-300 ease-out border border-emerald-400/50 dark:border-emerald-500/50"
      :class="
        showCopyToast
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      "
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
import { CheckCircleIcon } from '@/components/icons'
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@/composables/useDateFormat'
import { StatisticsCards, RecentLinksSection, SystemHealthPanel } from '@/components/dashboard'
import { config } from '@/config'

const linksStore = useLinksStore()
const healthStore = useHealthStore()
const { links, loading } = storeToRefs(linksStore)
const { status: healthData } = storeToRefs(healthStore)
const { fetchLinks } = linksStore
const { checkHealth } = healthStore
const { t } = useI18n()
const { formatDateTime } = useDateFormat()

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

    console.log('Link copied to clipboard:', shortUrl)
  } catch (err) {
    console.error('Failed to copy link:', err)
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
