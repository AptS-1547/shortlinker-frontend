import { BarChart3, Clock, Eye, Link } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDateFormat } from '@/hooks/useDateFormat'
import { LinkAPI } from '@/services/api'
import type { SerializableShortLink } from '@/services/api'
import { useHealthStore } from '@/stores/healthStore'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { formatRelative } = useDateFormat()

  // 仪表盘独立管理最近链接数据，避免与 LinksPage 的 store 冲突
  const [recentLinks, setRecentLinks] = useState<SerializableShortLink[]>([])
  const [totalCount, setTotalCount] = useState(0)
  // 健康状态由 AdminLayout 负责轮询，这里只读取
  const healthData = useHealthStore((state) => state.status)

  // 防止 StrictMode 双重执行
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchRecent = async () => {
      try {
        const res = await LinkAPI.fetchPaginated({ page: 1, page_size: 5 })
        setRecentLinks(res.data)
        setTotalCount(res.pagination.total)
      } catch (err) {
        console.error('Failed to fetch recent links:', err)
      }
    }
    fetchRecent()
  }, [])

  const stats = useMemo(() => {
    const totalLinks = totalCount
    const totalClicks = recentLinks.reduce(
      (sum, link) => sum + (link.click_count || 0),
      0,
    )
    const activeLinks = recentLinks.filter(
      (link) => !link.expires_at || new Date(link.expires_at) > new Date(),
    ).length

    return { totalLinks, totalClicks, activeLinks }
  }, [recentLinks, totalCount])

  const formattedUptime = useMemo(() => {
    const uptime = (healthData as { uptime?: number })?.uptime || 0
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
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
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
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
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
            <div className="text-2xl font-bold">{stats.activeLinks}</div>
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
