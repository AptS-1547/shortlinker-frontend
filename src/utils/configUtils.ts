import type { TFunction } from 'i18next'

/**
 * 获取配置键的翻译标签
 * 如果没有翻译，返回原始 key
 */
export function getConfigKeyLabel(key: string, t: TFunction): string {
  const translationKey = `config.keys.${key}`
  const translated = t(translationKey)
  // 如果翻译结果和 key 相同，说明没有翻译
  return translated === translationKey ? key : translated
}

/**
 * 格式化 JSON 字符串
 * 如果输入不是有效的 JSON，返回原字符串
 */
export function formatJSON(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonString
  }
}

/**
 * 验证 JSON 字符串是否有效
 */
export function isValidJSON(jsonString: string): boolean {
  if (jsonString.trim() === '') {
    return false
  }
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}
