<template>
  <div
    class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
  >
    <!-- 表单头部 -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-green-50/30 via-indigo-50/20 to-purple-50/30 dark:from-green-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl"
    ></div>
    <div
      class="relative p-4 border-b border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-indigo-50/30 dark:hover:from-gray-700/30 dark:hover:to-indigo-900/20 transition-all duration-300 rounded-t-xl"
      @click="toggleForm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'p-2 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm',
              editing
                ? 'bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/50 dark:to-orange-900/30 text-amber-700 dark:text-amber-400'
                : 'bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 text-indigo-700 dark:text-indigo-400',
            ]"
          >
            <EditIcon v-if="editing" className="w-5 h-5" />
            <PlusIcon v-else className="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {{ editing ? $t('links.editTitle') : $t('links.createTitle') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {{ editing ? $t('links.editDescription') : $t('links.createDescription') }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="editing && editingCode"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm"
          >
            {{ $t('links.editing', { code: editingCode }) }}
          </span>
          <ChevronDownIcon
            :class="[
              'w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300',
              { 'rotate-180': show },
            ]"
          />
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div
      :class="[
        'overflow-hidden transition-all duration-300 ease-in-out',
        show ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      ]"
    >
      <div class="relative p-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >
                {{ $t('links.shortCodeOptional') }}
              </label>
              <input
                v-model="localFormData.code"
                type="text"
                class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                :placeholder="$t('links.shortCodePlaceholder')"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {{ $t('links.shortCodeHelp') }}
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >
                {{ $t('links.expiresAtOptional') }}
              </label>
              <input
                v-model="localFormData.expires_at"
                type="datetime-local"
                class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {{ $t('links.expiresAtHelp') }}
              </p>
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.targetUrlRequired') }}</label
            >
            <input
              v-model="localFormData.target"
              type="url"
              required
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              :placeholder="$t('links.targetUrlPlaceholder')"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {{ $t('links.targetUrlHelp') }}
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide"
              >{{ $t('links.passwordOptional') }}</label
            >
            <input
              v-model="localFormData.password"
              type="password"
              class="w-full px-3 py-2 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              :placeholder="$t('links.passwordPlaceholder')"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {{ $t('links.passwordHelp') }}
            </p>
          </div>

          <div
            class="flex items-center justify-between pt-4 border-t-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="handleCollapse"
                class="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 uppercase tracking-wide"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                v-if="editing"
                type="button"
                @click="handleCancelEdit"
                class="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 uppercase tracking-wide"
              >
                {{ $t('links.clearEdit') }}
              </button>
            </div>

            <button
              type="submit"
              :disabled="loading || !localFormData.target"
              class="px-6 py-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-indigo-500 dark:to-purple-500 text-white font-bold rounded-lg hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-indigo-500 dark:hover:via-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 uppercase tracking-wide text-sm"
            >
              <span v-if="loading" class="flex items-center">
                <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {{ editing ? $t('links.updating') : $t('links.creating') }}
              </span>
              <span v-else>
                {{ editing ? $t('links.updateLink') : $t('links.createLink') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlusIcon, EditIcon, ChevronDownIcon, SpinnerIcon } from '@/components/icons'
import type { LinkPayload } from '@/services/api'

interface Props {
  modelValue: LinkPayload
  show?: boolean
  editing?: boolean
  editingCode?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: LinkPayload): void
  (e: 'update:show', value: boolean): void
  (e: 'submit'): void
  (e: 'cancel'): void
  (e: 'cancelEdit'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  editing: false,
  loading: false,
})

const emit = defineEmits<Emits>()

const localFormData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function toggleForm() {
  emit('update:show', !props.show)
}

function handleSubmit() {
  emit('submit')
}

function handleCollapse() {
  emit('cancel')
}

function handleCancelEdit() {
  emit('cancelEdit')
}
</script>
