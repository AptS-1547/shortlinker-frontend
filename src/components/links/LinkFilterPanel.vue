<template>
  <div
    class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl"
    ></div>
    <div
      class="relative p-4 border-b border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-indigo-50/30 dark:hover:from-gray-700/30 dark:hover:to-indigo-900/20 transition-all duration-300 rounded-t-xl"
      @click="toggleFilter"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              ></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {{ $t('links.filterTitle') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {{ $t('links.filterDescription') }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="activeFilterCount > 0"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
          >
            {{ $t('links.activeFilters', { count: activeFilterCount }) }}
          </span>
          <ChevronDownIcon
            :class="[
              'w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300',
              { 'rotate-180': showFilter },
            ]"
          />
        </div>
      </div>
    </div>

    <!-- 筛选器内容 -->
    <div
      :class="[
        'overflow-hidden transition-all duration-300 ease-in-out',
        showFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      ]"
    >
      <div class="relative p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('common.search') }}</label
            >
            <input
              v-model="localFilter.search"
              type="text"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              :placeholder="$t('links.search.placeholder')"
            />
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.status') }}</label
            >
            <select
              v-model="localFilter.status"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="">{{ $t('links.filterOptions.allLinks') }}</option>
              <option value="active">{{ $t('links.filterOptions.activeOnly') }}</option>
              <option value="expired">{{ $t('links.filterOptions.expiredOnly') }}</option>
              <option value="permanent">{{ $t('links.filterOptions.permanentLinks') }}</option>
              <option value="temporary">{{ $t('links.filterOptions.temporaryLinks') }}</option>
            </select>
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.createdAfter') }}</label
            >
            <input
              v-model="localFilter.created_after"
              type="date"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.createdBefore') }}</label
            >
            <input
              v-model="localFilter.created_before"
              type="date"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.pageSize') }}</label
            >
            <select
              v-model="localFilter.page_size"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100"
            >
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
              <option :value="50">50 per page</option>
              <option :value="100">100 per page</option>
            </select>
          </div>
        </div>

        <div
          class="flex items-center justify-between pt-4 border-t-2 border-gray-200/50 dark:border-gray-700/50 mt-4"
        >
          <button
            @click="handleReset"
            class="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 uppercase tracking-wide"
          >
            {{ $t('common.reset') }}
          </button>
          <button
            @click="handleApply"
            class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white font-bold rounded-lg hover:from-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 uppercase tracking-wide text-sm"
          >
            {{ $t('common.apply') }} {{ $t('common.filter') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronDownIcon } from '@/components/icons'

export interface FilterFormData {
  search: string
  status: string
  page_size: number
  created_after: string
  created_before: string
}

interface Props {
  modelValue: FilterFormData
  show?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: FilterFormData): void
  (e: 'update:show', value: boolean): void
  (e: 'apply'): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})

const emit = defineEmits<Emits>()

const showFilter = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const localFilter = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const activeFilterCount = computed(() => {
  let count = 0
  if (localFilter.value.search) count++
  if (localFilter.value.status) count++
  if (localFilter.value.created_after) count++
  if (localFilter.value.created_before) count++
  return count
})

function toggleFilter() {
  showFilter.value = !showFilter.value
}

function handleApply() {
  emit('apply')
}

function handleReset() {
  emit('reset')
}
</script>
