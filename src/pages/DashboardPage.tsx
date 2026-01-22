import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiBarChart2 as BarChart3,
  FiClock as Clock,
  FiEye as Eye,
  FiLink as Link,
} from 'react-icons/fi'
import PageHeader from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDateFormat } from '@/hooks/useDateFormat'
import type { StatsResponse, LinkResponse } from '@/services/api'
import { LinkAPI } from '@/services/api'
import { useHealthStore } from '@/stores/healthStore'
import { dashboardLogger } from '@/utils/logger'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { formatRelative } = useDateFormat()

  // 仪表盘独立管理最近链接数据，避免与 LinksPage 的 store 冲突
  const [recentLinks, setRecentLinks] = useState<LinkResponse[]>([])
  const [stats, setStats] = useState<StatsResponse>({
    total_links: 0,
    total_clicks: 0,
    active_links: 0,
  })
  // 健康状态由 AdminLayout 负责轮询，这里只读取
  const healthData = useHealthStore((state) => state.status)

  // 防止 StrictMode 双重执行
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () => {
      try {
        // 并行获取统计数据和最近链接
        const [statsRes, recentRes] = await Promise.all([
          LinkAPI.fetchStats(),
          LinkAPI.fetchPaginated({
            page: 1,
            page_size: 5,
            created_after: null,
            created_before: null,
            only_expired: null,
            only_active: null,
            search: null,
          }),
        ])
        setStats(statsRes)
        setRecentLinks(recentRes.data)
      } catch (err) {
        dashboardLogger.error('Failed to fetch dashboard data:', err)
      }
    }
    fetchData()
  }, [])

  const formattedUptime = useMemo(() => {
    const uptime = healthData?.uptime ?? 0
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const secs = uptime % 60

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }, [healthData])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.totalLinks')}
            </CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_links}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.linksCreated')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.totalClicks')}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_clicks}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.clicksTracked')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.activeLinks')}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_links}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.notExpired')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.uptime')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedUptime}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.systemHealth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Links */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentLinks.title')}</CardTitle>
          <CardDescription>
            {t('dashboard.recentLinks.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLinks.length > 0 ? (
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div
                  key={link.code}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground font-mono">
                      /{link.code}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.target}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-foreground">
                      {link.click_count || 0}{' '}
                      {t('dashboard.recentLinks.clicks')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelative(link.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {t('dashboard.recentLinks.noLinks')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
