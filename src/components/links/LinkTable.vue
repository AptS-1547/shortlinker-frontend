<template>
  <div
    class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-blue-50/20 to-indigo-50/30 dark:from-gray-800/30 dark:via-blue-900/10 dark:to-indigo-900/10 rounded-xl"
    ></div>
    <div class="relative p-4 border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="p-2 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm"
          >
            <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ $t('links.shortLinks') }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <span
            class="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 px-2 py-1 rounded border border-gray-200/50 dark:border-gray-600/50"
          >
            {{ filteredCount }}
            <span v-if="filteredCount !== totalCount">of {{ totalCount }}</span>
            total
            <span v-if="hasActiveFilters">(filtered)</span>
          </span>
          <span
            class="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/20 px-2 py-1 rounded border border-indigo-200/50 dark:border-indigo-700/50"
          >
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
      </div>
    </div>

    <div class="relative p-4">
      <!-- Loading State -->
      <div v-if="loading && links.length === 0" class="text-center py-8">
        <div class="animate-spin mx-auto mb-4">
          <SpinnerIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500 dark:text-red-400 mb-4">{{ error }}</div>
        <button
          @click="emit('retry')"
          class="px-4 py-2 bg-indigo-500 dark:bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
        >
          {{ $t('common.retry') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="links.length === 0" class="text-center py-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
        >
          <LinkIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ hasActiveFilters ? $t('links.noMatchingLinks') : $t('links.noLinksYet') }}
        </h3>
        <p class="text-gray-700 dark:text-gray-400 mb-4">
          {{ hasActiveFilters ? $t('links.noMatchingLinksDesc') : $t('links.noLinksYetDesc') }}
        </p>
        <div class="flex items-center justify-center gap-2">
          <button
            v-if="hasActiveFilters"
            @click="emit('clearFilters')"
            class="inline-flex items-center px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
          >
            {{ $t('links.clearFilters') }}
          </button>
          <button
            @click="emit('createNew')"
            class="inline-flex items-center px-4 py-2 bg-indigo-500 dark:bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {{ hasActiveFilters ? $t('links.createNewLink') : $t('links.createFirstLink') }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200/70 dark:border-gray-700/70">
              <th
                class="text-left py-3 px-4 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
              >
                {{ $t('links.table.code') }}
              </th>
              <th
                class="text-left py-3 px-4 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
              >
                {{ $t('links.table.targetUrl') }}
              </th>
              <th
                class="text-left py-3 px-4 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
              >
                {{ $t('links.table.status') }}
              </th>
              <th
                class="text-left py-3 px-4 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
              >
                {{ $t('links.table.created') }}
              </th>
              <th
                class="text-left py-3 px-4 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
              >
                {{ $t('links.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <LinkTableRow
              v-for="link in links"
              :key="link.code"
              :link="link"
              :copied="copiedLink === link.code"
              :format-date="formatDate"
              @copy="(code) => emit('copy', code)"
              @edit="(link) => emit('edit', link)"
              @delete="(link) => emit('delete', link)"
            />
          </tbody>
        </table>

        <slot name="pagination" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LinkIcon, SpinnerIcon, PlusIcon } from '@/components/icons'
import LinkTableRow from './LinkTableRow.vue'
import type { SerializableShortLink } from '@/services/api'

interface Props {
  links: SerializableShortLink[]
  loading?: boolean
  error?: string | null
  filteredCount: number
  totalCount: number
  currentPage: number
  totalPages: number
  hasActiveFilters?: boolean
  copiedLink?: string | null
  formatDate: (date: string) => string
}

interface Emits {
  (e: 'retry'): void
  (e: 'clearFilters'): void
  (e: 'createNew'): void
  (e: 'copy', code: string): void
  (e: 'edit', link: SerializableShortLink): void
  (e: 'delete', link: SerializableShortLink): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  hasActiveFilters: false,
  copiedLink: null,
})

const emit = defineEmits<Emits>()
</script>
