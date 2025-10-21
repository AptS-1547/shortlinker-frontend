<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <!-- 服务状态卡片 - 特别设计 -->
    <div
      :class="[
        'group relative p-4 rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
        healthStatus === 'healthy'
          ? 'bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 dark:from-emerald-900/20 dark:via-emerald-800/10 dark:to-teal-900/20 border-emerald-200/70 dark:border-emerald-700/50'
          : healthStatus === 'unhealthy'
            ? 'bg-gradient-to-br from-red-50 via-red-100/50 to-pink-50 dark:from-red-900/20 dark:via-red-800/10 dark:to-pink-900/20 border-red-200/70 dark:border-red-700/50'
            : 'bg-gradient-to-br from-amber-50 via-amber-100/50 to-orange-50 dark:from-amber-900/20 dark:via-amber-800/10 dark:to-orange-900/20 border-amber-200/70 dark:border-amber-700/50',
      ]"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div class="relative flex items-center">
        <div
          :class="[
            'p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300',
            healthStatus === 'healthy'
              ? 'bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-800/50 dark:to-emerald-700/30'
              : healthStatus === 'unhealthy'
                ? 'bg-gradient-to-br from-red-200 to-red-100 dark:from-red-800/50 dark:to-red-700/30'
                : 'bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/50 dark:to-amber-700/30',
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
                    : 'bg-amber-500 dark:bg-amber-400 animate-pulse',
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
            <ExclamationCircleIcon v-else className="w-4 h-4 text-amber-700 dark:text-amber-400" />
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
                  : 'text-amber-800 dark:text-amber-300',
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
                  : 'text-amber-900 dark:text-amber-200',
            ]"
          >
            {{ $t(`layout.health.${healthStatus}`) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 总链接数卡片 -->
    <div
      class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div class="relative flex items-center">
        <div
          class="p-2 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
        >
          <LinkIcon className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {{ $t('dashboard.totalLinks') }}
          </h3>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {{ totalLinks }}
          </p>
        </div>
      </div>
    </div>

    <!-- 活跃链接数卡片 -->
    <div
      class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div class="relative flex items-center">
        <div
          class="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
        >
          <CheckCircleIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {{ $t('dashboard.activeLinks') }}
          </h3>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {{ activeLinks }}
          </p>
        </div>
      </div>
    </div>

    <!-- 响应时间卡片 -->
    <div
      class="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div class="relative flex items-center">
        <div
          class="p-2 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
        >
          <ClockIcon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {{ $t('dashboard.responseTime') }}
          </h3>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {{ responseTime }}ms
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LinkIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@/components/icons'

interface Props {
  healthStatus: string
  totalLinks: number
  activeLinks: number
  responseTime: number
}

defineProps<Props>()
</script>
