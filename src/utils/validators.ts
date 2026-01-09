/**
 * 表单验证工具函数
 */

/**
 * 验证是否是有效的 URL
 * @param url - URL 字符串
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证是否是有效的 HTTP/HTTPS URL
 * @param url - URL 字符串
 * @returns 是否有效
 */
export function isValidHttpUrl(url: string): boolean {
  if (!isValidUrl(url)) {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 验证是否是有效的短链接代码
 * 只允许字母、数字、下划线和短横线
 * @param code - 短链接代码
 * @param minLength - 最小长度（默认 1）
 * @param maxLength - 最大长度（默认 50）
 * @returns 是否有效
 */
export function isValidShortCode(
  code: string,
  minLength: number = 1,
  maxLength: number = 50,
): boolean {
  if (!code || typeof code !== 'string') {
    return false
  }

  if (code.length < minLength || code.length > maxLength) {
    return false
  }

  // 只允许字母、数字、下划线和短横线
  const pattern = /^[a-zA-Z0-9_-]+$/
  return pattern.test(code)
}

/**
 * 验证密码强度
 * @param password - 密码字符串
 * @returns 密码强度对象
 */
export interface PasswordStrength {
  isValid: boolean
  score: number // 0-4，0最弱，4最强
  feedback: string[]
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: ['Password is required'],
    }
  }

  // 长度检查
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters')
  } else {
    score++
  }

  if (password.length >= 12) {
    score++
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score++
  } else {
    feedback.push('Password should contain lowercase letters')
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score++
  } else {
    feedback.push('Password should contain uppercase letters')
  }

  // 包含数字
  if (/\d/.test(password)) {
    score++
  } else {
    feedback.push('Password should contain numbers')
  }

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++
  } else {
    feedback.push('Password should contain special characters')
  }

  // 限制分数最大值为 4
  score = Math.min(score, 4)

  return {
    isValid: password.length >= 8 && score >= 2,
    score,
    feedback,
  }
}

/**
 * 验证邮箱地址
 * @param email - 邮箱字符串
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // 简单的邮箱验证正则
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

/**
 * 验证日期是否在有效范围内
 * @param date - 日期字符串
 * @param minDate - 最小日期（可选）
 * @param maxDate - 最大日期（可选）
 * @returns 是否有效
 */
export function isValidDate(
  date: string,
  minDate?: string,
  maxDate?: string,
): boolean {
  if (!date || typeof date !== 'string') {
    return false
  }

  try {
    const dateObj = new Date(date)

    // 检查是否是有效日期
    if (Number.isNaN(dateObj.getTime())) {
      return false
    }

    // 检查最小日期
    if (minDate) {
      const minDateObj = new Date(minDate)
      if (dateObj < minDateObj) {
        return false
      }
    }

    // 检查最大日期
    if (maxDate) {
      const maxDateObj = new Date(maxDate)
      if (dateObj > maxDateObj) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

/**
 * 验证字符串是否为空或只包含空白字符
 * @param str - 字符串
 * @returns 是否为空
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0
}

/**
 * 验证字符串长度是否在范围内
 * @param str - 字符串
 * @param min - 最小长度
 * @param max - 最大长度
 * @returns 是否在范围内
 */
export function isLengthInRange(
  str: string,
  min: number,
  max: number,
): boolean {
  if (!str || typeof str !== 'string') {
    return false
  }

  const length = str.length
  return length >= min && length <= max
}
