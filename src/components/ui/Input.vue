<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 dark:text-red-400">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        v-model="localValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
      <div v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string | number
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'url'
    | 'number'
    | 'tel'
    | 'search'
    | 'date'
    | 'datetime-local'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
)

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const labelClasses = computed(() => {
  return 'block text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide'
})

const inputClasses = computed(() => {
  const baseClasses =
    'w-full px-4 py-2.5 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm'

  const stateClasses = props.error
    ? 'border-2 border-red-300 dark:border-red-600 bg-red-50/80 dark:bg-red-900/20 focus:ring-red-500/50 focus:border-red-400 dark:focus:border-red-500'
    : 'border-2 border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-700/80 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500'

  return `${baseClasses} ${stateClasses}`
})
</script>
