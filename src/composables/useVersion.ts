import { computed } from 'vue'

declare global {
  interface Window {
    __APP_CONFIG__: {
      basePath: string
      adminRoutePrefix: string
      healthRoutePrefix: string
      shortlinkerVersion: string
    }
  }
}

export function useVersion() {
  const version = computed(() => {
    return window.__APP_CONFIG__?.shortlinkerVersion || 'unknown'
  })

  const displayVersion = computed(() => {
    // 添加 v 前缀，如果原本没有的话
    const cleanVersion = version.value.replace('-dirty', '')
    return cleanVersion.startsWith('v') ? cleanVersion : `v${cleanVersion}`
  })

  const versionType = computed(() => {
    const ver = version.value.toLowerCase()

    if (ver.includes('alpha')) return 'alpha'
    if (ver.includes('beta')) return 'beta'
    if (ver.includes('rc')) return 'rc'

    // 纯数字版本号，如 2.0.0 或 v2.0.0
    return 'release'
  })

  const isDevelopment = computed(() => versionType.value === 'alpha')
  const isPreRelease = computed(() => ['beta', 'rc'].includes(versionType.value))

  const versionBadgeColor = computed(() => {
    switch (versionType.value) {
      case 'alpha':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'beta':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'rc':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'release':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  })

  const versionLabel = computed(() => {
    switch (versionType.value) {
      case 'alpha':
        return 'Alpha'
      case 'beta':
        return 'Beta'
      case 'rc':
        return 'RC'
      case 'release':
        return 'Release'
      default:
        return 'Unknown'
    }
  })

  return {
    displayVersion,
    isDevelopment,
    isPreRelease,
    versionBadgeColor,
    versionLabel,
  }
}
