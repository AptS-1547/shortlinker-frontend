import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiGlobe,
  FiKey,
  FiList,
  FiMoreHorizontal,
  FiMousePointer,
  FiRefreshCw,
  FiShield,
  FiToggleRight,
} from 'react-icons/fi'
import { toast } from 'sonner'

import {
  SystemConfigEditDialog,
  SystemConfigHistoryDialog,
  SystemConfigTable,
} from '@/components/settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SystemConfigItem } from '@/services/api'
import { useSystemConfigStore } from '@/stores/systemConfigStore'

// 配置分组定义
const CONFIG_GROUPS = [
  { key: 'all', icon: FiList },
  { key: 'routes', icon: FiGlobe },
  { key: 'api', icon: FiKey },
  { key: 'features', icon: FiToggleRight },
  { key: 'click', icon: FiMousePointer },
  { key: 'cors', icon: FiShield },
  { key: 'other', icon: FiMoreHorizontal },
] as const

type ConfigGroupKey = (typeof CONFIG_GROUPS)[number]['key']

// 组件 Props
interface SystemConfigTabProps {
  isActive?: boolean
}

// 从配置 key 提取分组
function getConfigGroup(key: string): string {
  const dotIndex = key.indexOf('.')
  if (dotIndex === -1) return 'other'
  return key.substring(0, dotIndex)
}

// 提取 key 的第二部分（点号后的部分）用于排序
function getConfigSuffix(key: string): string {
  const dotIndex = key.indexOf('.')
  if (dotIndex === -1) return key // 没有点号，直接返回原 key
  return key.substring(dotIndex + 1) // 返回点号后的部分
}

export function SystemConfigTab({ isActive = true }: SystemConfigTabProps) {
  const { t } = useTranslation()
  const {
    configs,
    fetching,
    updating,
    reloading,
    fetchConfigs,
    updateConfig,
    reloadConfigs,
  } = useSystemConfigStore()

  // 分组状态
  const [activeGroup, setActiveGroup] = useState<ConfigGroupKey>('all')

  // 对话框状态
  const [editingConfig, setEditingConfig] = useState<SystemConfigItem | null>(
    null,
  )
  const [historyConfig, setHistoryConfig] = useState<SystemConfigItem | null>(
    null,
  )

  useEffect(() => {
    if (!isActive) return // 不激活时不请求
    const controller = new AbortController()
    fetchConfigs(controller.signal).catch(() => {
      // Error is handled by the store
    })
    return () => controller.abort()
  }, [isActive, fetchConfigs])

  // 按分组整理配置
  const groupedConfigs = useMemo(() => {
    const groups: Record<string, SystemConfigItem[]> = {
      routes: [],
      api: [],
      features: [],
      click: [],
      cors: [],
      other: [],
    }

    configs.forEach((config) => {
      const group = getConfigGroup(config.key)
      if (groups[group]) {
        groups[group].push(config)
      } else {
        groups.other.push(config)
      }
    })

    // 对每个分组内的配置项按 key 的第二部分排序
    Object.keys(groups).forEach((groupKey) => {
      groups[groupKey].sort((a, b) => {
        const suffixA = getConfigSuffix(a.key)
        const suffixB = getConfigSuffix(b.key)
        return suffixA.localeCompare(suffixB)
      })
    })

    return groups
  }, [configs])

  // 各分组的配置数量
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { all: configs.length }
    Object.entries(groupedConfigs).forEach(([key, items]) => {
      counts[key] = items.length
    })
    return counts
  }, [configs, groupedConfigs])

  // 按分组筛选后的配置列表
  const filteredConfigs = useMemo(() => {
    if (activeGroup === 'all') {
      // 按分组顺序排列：routes -> api -> features -> click -> cors -> other
      return [
        ...groupedConfigs.routes,
        ...groupedConfigs.api,
        ...groupedConfigs.features,
        ...groupedConfigs.click,
        ...groupedConfigs.cors,
        ...groupedConfigs.other,
      ]
    }
    return groupedConfigs[activeGroup] || []
  }, [groupedConfigs, activeGroup])

  const handleReload = async () => {
    try {
      await reloadConfigs()
      toast.success(
        t('config.reloadSuccess', 'Configuration reloaded successfully'),
      )
    } catch {
      toast.error(t('config.reloadError', 'Failed to reload configuration'))
    }
  }

  const handleSave = async (key: string, value: string) => {
    const result = await updateConfig(key, value)
    if (result.requires_restart) {
      toast.warning(
        result.message ||
          t(
            'config.savedNeedRestart',
            'Configuration saved. Please restart the server for changes to take effect.',
          ),
      )
    } else {
      toast.success(
        t('config.updateSuccess', 'Configuration updated successfully'),
      )
    }
    return result
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {t('config.title', 'System Configuration')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('config.description', 'Manage runtime configuration settings')}
          </p>
        </div>
        <Button variant="outline" onClick={handleReload} disabled={reloading}>
          <FiRefreshCw
            className={`mr-2 h-4 w-4 ${reloading ? 'animate-spin' : ''}`}
          />
          {t('config.reload', 'Reload')}
        </Button>
      </div>

      {/* 分组 Tab */}
      <Tabs
        value={activeGroup}
        onValueChange={(v) => setActiveGroup(v as ConfigGroupKey)}
      >
        <TabsList className="flex-wrap h-auto gap-1">
          {CONFIG_GROUPS.map((group) => {
            const Icon = group.icon
            const count = groupCounts[group.key] || 0
            // 跳过没有配置的分组（除了 all）
            if (group.key !== 'all' && count === 0) return null
            return (
              <TabsTrigger
                key={group.key}
                value={group.key}
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {t(`config.groups.${group.key}`, group.key)}
                </span>
                <span className="text-xs opacity-60">({count})</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* 配置列表 - 所有 Tab 共用同一个内容区域 */}
        <Card className="mt-4">
          <CardContent className="p-0">
            {fetching ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <SystemConfigTable
                configs={filteredConfigs}
                onEdit={setEditingConfig}
                onHistory={setHistoryConfig}
              />
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* 编辑对话框 */}
      <SystemConfigEditDialog
        config={editingConfig}
        open={!!editingConfig}
        onOpenChange={(open) => !open && setEditingConfig(null)}
        onSave={handleSave}
        saving={updating}
      />

      {/* 历史对话框 */}
      <SystemConfigHistoryDialog
        config={historyConfig}
        open={!!historyConfig}
        onOpenChange={(open) => !open && setHistoryConfig(null)}
      />
    </div>
  )
}
