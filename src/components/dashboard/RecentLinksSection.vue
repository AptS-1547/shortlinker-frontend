<template>
  <div
    class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl"
    ></div>
    <div class="relative">
      <h2
        class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-gray-100 dark:to-indigo-300 bg-clip-text text-transparent"
      >
        {{ $t('dashboard.recentLinks') }}
      </h2>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin mx-auto mb-4">
          <SpinnerIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="links.length === 0" class="text-center py-8">
        <div
          class="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-sm"
        >
          <LinkIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ $t('dashboard.noLinks') }}
        </h3>
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
          v-for="link in links"
          :key="link.code"
          class="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/40 dark:from-gray-700/50 dark:to-gray-600/30 rounded-lg hover:from-indigo-50/80 hover:to-purple-50/40 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-200/70 dark:hover:border-indigo-700/50 hover:shadow-sm hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <button
              @click="emit('copy', link.code)"
              :class="[
                'font-mono text-sm px-3 py-1.5 rounded-lg transition-all duration-300 border shadow-sm hover:shadow-md relative',
                copiedLink === link.code
                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 scale-105 shadow-md'
                  : link.password
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:from-amber-200 hover:to-amber-100 dark:hover:from-amber-800/40 dark:hover:to-amber-700/30 group-hover:scale-105'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-600 dark:to-gray-500 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-500 hover:from-indigo-100 hover:to-indigo-50 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/20 hover:text-indigo-800 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 group-hover:scale-105',
              ]"
              :title="
                copiedLink === link.code
                  ? $t('common.copied')
                  : link.password
                    ? $t('links.copyPasswordProtectedLink')
                    : $t('links.copyLinkTitle')
              "
            >
              <div class="flex items-center gap-1.5">
                <span class="font-bold">{{ link.code }}</span>
                <!-- 密码保护标识 -->
                <span v-if="link.password" class="text-xs" :title="$t('links.passwordProtected')"
                  >🔒</span
                >
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
            <span
              class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 font-medium bg-gray-100/80 dark:bg-gray-600/50 px-2 py-1 rounded"
            >
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
</template>

<script setup lang="ts">
import {
  LinkIcon,
  SpinnerIcon,
  PlusIcon,
  CheckCircleIcon,
  CopyIcon,
  ChevronRightIcon,
} from '@/components/icons'
import type { SerializableShortLink } from '@/services/api'

interface Props {
  links: SerializableShortLink[]
  loading?: boolean
  copiedLink?: string | null
  formatDate: (date: string) => string
}

interface Emits {
  (e: 'copy', code: string): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  copiedLink: null,
})

const emit = defineEmits<Emits>()
</script>
