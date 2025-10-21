<template>
  <tr
    class="border-b border-gray-100/70 dark:border-gray-700/70 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-indigo-50/40 dark:hover:from-gray-700/50 dark:hover:to-indigo-900/20 transition-all duration-300 group"
  >
    <td class="py-3 px-4">
      <button
        @click="emit('copy', link.code)"
        :class="[
          'font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-300 border shadow-sm hover:shadow-md',
          copied
            ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 scale-105 shadow-md'
            : link.password
              ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-700 dark:to-amber-600 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-600 hover:from-amber-200 hover:to-amber-100 dark:hover:from-amber-600 dark:hover:to-amber-500 hover:text-amber-900 dark:hover:text-amber-100 hover:border-amber-300 dark:hover:border-amber-500 group-hover:scale-105'
              : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:from-indigo-100 hover:to-indigo-50 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/20 hover:text-indigo-800 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 group-hover:scale-105',
        ]"
        :title="
          copied
            ? $t('common.copied')
            : link.password
              ? $t('links.copyPasswordProtectedLink')
              : $t('links.copyLinkTitle')
        "
      >
        <div class="flex items-center gap-1.5">
          <span class="font-bold">{{ link.code }}</span>
          <span v-if="link.password && !copied" class="text-amber-600 dark:text-amber-400">🔒</span>
          <CheckCircleIcon
            v-if="copied"
            className="w-3 h-3 text-emerald-700 dark:text-emerald-400"
          />
          <CopyIcon
            v-else
            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </button>
    </td>
    <td class="py-3 px-4">
      <a
        :href="link.target"
        target="_blank"
        rel="noopener noreferrer"
        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 truncate block max-w-xs"
      >
        {{ link.target }}
      </a>
    </td>
    <td class="py-3 px-4">
      <div class="flex flex-col gap-1">
        <span
          v-if="link.expires_at"
          :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit',
            isExpired(link.expires_at)
              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
          ]"
        >
          {{ isExpired(link.expires_at) ? $t('links.expired') : $t('links.active') }}
        </span>
        <span
          v-else
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 w-fit"
        >
          {{ $t('links.permanent') }}
        </span>
        <span v-if="link.expires_at" class="text-xs text-gray-500 dark:text-gray-400">
          {{ isExpired(link.expires_at) ? $t('links.expired') : $t('analytics.expires') }}:
          {{ formatDate(link.expires_at) }}
        </span>
        <span
          v-if="link.password"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 w-fit"
        >
          🔒 {{ $t('links.passwordProtected') }}
        </span>
      </div>
    </td>
    <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
      {{ formatDate(link.created_at) }}
    </td>
    <td class="py-3 px-4">
      <div class="flex items-center gap-1">
        <button
          @click="emit('edit', link)"
          class="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          :title="$t('common.edit') + ' ' + $t('links.title')"
        >
          <EditIcon className="w-4 h-4" />
        </button>

        <button
          @click="emit('delete', link)"
          class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          :title="$t('common.delete') + ' ' + $t('links.title')"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { CheckCircleIcon, CopyIcon, EditIcon, DeleteIcon } from '@/components/icons'
import type { SerializableShortLink } from '@/services/api'
import { isExpired } from '@/utils/dateFormatter'

interface Props {
  link: SerializableShortLink
  copied?: boolean
  formatDate: (date: string) => string
}

interface Emits {
  (e: 'copy', code: string): void
  (e: 'edit', link: SerializableShortLink): void
  (e: 'delete', link: SerializableShortLink): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
