import { useEffect, useMemo, useState } from 'react'
import { systemConfigService } from '@/services/systemConfigService'
import type { ConfigSchema } from '@/services/types.generated'

// 全局缓存，schema 基本不变
let cachedSchemas: ConfigSchema[] | null = null
let fetchPromise: Promise<ConfigSchema[]> | null = null

/**
 * 获取所有配置的 schema
 *
 * 使用全局缓存，只请求一次
 */
export function useConfigSchema() {
  const [schemas, setSchemas] = useState<ConfigSchema[]>(cachedSchemas || [])
  const [isLoading, setIsLoading] = useState(!cachedSchemas)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // 已经有缓存，不需要再请求
    if (cachedSchemas) {
      setSchemas(cachedSchemas)
      setIsLoading(false)
      return
    }

    // 已经有正在进行的请求，等待它完成
    if (fetchPromise) {
      fetchPromise
        .then((data) => {
          setSchemas(data)
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
        })
      return
    }

    // 发起新请求
    setIsLoading(true)
    fetchPromise = systemConfigService.fetchSchema()

    fetchPromise
      .then((data) => {
        cachedSchemas = data
        setSchemas(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err)
        setIsLoading(false)
        fetchPromise = null // 失败了允许重试
      })
  }, [])

  return { data: schemas, isLoading, error }
}

/**
 * 根据 key 获取单个配置的 schema
 */
export function useConfigSchemaByKey(key: string) {
  const { data: schemas, isLoading, error } = useConfigSchema()

  const schema = useMemo(
    () => schemas?.find((s) => s.key === key),
    [schemas, key],
  )

  return { schema, isLoading, error }
}
