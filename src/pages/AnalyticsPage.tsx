import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiBarChart2 as BarChart3,
  FiDownload as Download,
  FiGlobe as Globe,
  FiLink as Link2,
  FiTrendingUp as TrendingUp,
} from 'react-icons/fi'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { analyticsService } from '@/services/analyticsService'
import type {
  GeoStats,
  GroupBy,
  ReferrerStats,
  TopLink,
  TrendData,
} from '@/services/types.generated'

// Chart colors
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

// Date range options
type DateRange = '7d' | '30d' | '90d' | '1y'

function getDateRange(range: DateRange): { start: string; end: string } {
  const end = new Date()
  const start = new Date()

  switch (range) {
    case '7d':
      start.setDate(end.getDate() - 7)
      break
    case '30d':
      start.setDate(end.getDate() - 30)
      break
    case '90d':
      start.setDate(end.getDate() - 90)
      break
    case '1y':
      start.setFullYear(end.getFullYear() - 1)
      break
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export default function AnalyticsPage() {
  const { t } = useTranslation()

  // State
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [topLinks, setTopLinks] = useState<TopLink[]>([])
  const [referrers, setReferrers] = useState<ReferrerStats[]>([])
  const [geoStats, setGeoStats] = useState<GeoStats[]>([])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { start, end } = getDateRange(dateRange)
    const params = {
      start_date: start,
      end_date: end,
      group_by: groupBy,
      limit: 10,
    }

    try {
      const [trends, top, refs, geo] = await Promise.all([
        analyticsService.getTrends(params),
        analyticsService.getTopLinks(params),
        analyticsService.getReferrers(params),
        analyticsService.getGeoStats(params),
      ])

      setTrendData(trends)
      setTopLinks(top)
      setReferrers(refs)
      setGeoStats(geo)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError(t('analytics.error.fetchFailed'))
    } finally {
      setLoading(false)
    }
  }, [dateRange, groupBy, t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Export handler
  const handleExport = async () => {
    try {
      const { start, end } = getDateRange(dateRange)
      const blob = await analyticsService.exportReport({
        start_date: start,
        end_date: end,
        group_by: null,
        limit: null,
      })

      // Download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_${dateRange}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  // Calculate total clicks
  const totalClicks =
    trendData?.values.reduce((sum, v) => sum + Number(v), 0) ?? 0

  // Transform data for charts
  const trendChartData =
    trendData?.labels.map((label, i) => ({
      date: label,
      clicks: Number(trendData.values[i]),
    })) ?? []

  const topLinksChartData = topLinks.map((link) => ({
    code: link.code,
    clicks: Number(link.clicks),
  }))

  const referrerChartData = referrers.map((ref, index) => ({
    name: ref.referrer,
    value: Number(ref.count),
    percentage: ref.percentage,
    fill: COLORS[index % COLORS.length],
  }))

  // Actions for PageHeader
  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Date Range Selector */}
      <Select
        value={dateRange}
        onValueChange={(v) => setDateRange(v as DateRange)}
      >
        <SelectTrigger className="w-30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">{t('analytics.dateRange.7d')}</SelectItem>
          <SelectItem value="30d">{t('analytics.dateRange.30d')}</SelectItem>
          <SelectItem value="90d">{t('analytics.dateRange.90d')}</SelectItem>
          <SelectItem value="1y">{t('analytics.dateRange.1y')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Group By Selector */}
      <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
        <SelectTrigger className="w-25">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">{t('analytics.groupBy.hour')}</SelectItem>
          <SelectItem value="day">{t('analytics.groupBy.day')}</SelectItem>
          <SelectItem value="week">{t('analytics.groupBy.week')}</SelectItem>
          <SelectItem value="month">{t('analytics.groupBy.month')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="w-4 h-4 mr-2" />
        {t('analytics.export')}
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('analytics.title')}
        description={t('analytics.description')}
        actions={headerActions}
      />

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalClicks')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {totalClicks.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.topLinksCount')}
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{topLinks.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.referrersCount')}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{referrers.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.countriesCount')}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {new Set(geoStats.map((g) => g.country)).size}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Click Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('analytics.clickTrends')}
          </CardTitle>
          <CardDescription>{t('analytics.clickTrendsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-75 w-full" />
          ) : trendChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-75 flex items-center justify-center text-muted-foreground">
              {t('analytics.noData')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              {t('analytics.topLinks')}
            </CardTitle>
            <CardDescription>{t('analytics.topLinksDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-62.5 w-full" />
            ) : topLinksChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topLinksChartData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="code"
                    width={80}
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-62.5 flex items-center justify-center text-muted-foreground">
                {t('analytics.noData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t('analytics.referrers')}
            </CardTitle>
            <CardDescription>{t('analytics.referrersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-62.5 w-full" />
            ) : referrerChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={referrerChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value, _name, entry) => {
                      const payload =
                        entry.payload as (typeof referrerChartData)[number]
                      return [
                        `${value} (${payload.percentage.toFixed(1)}%)`,
                        payload.name,
                      ]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-62.5 flex items-center justify-center text-muted-foreground">
                {t('analytics.noData')}
              </div>
            )}
            {/* Legend */}
            {referrerChartData.length > 0 && (
              <div className="mt-4 space-y-2">
                {referrerChartData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground truncate flex-1">
                      {item.name}
                    </span>
                    <span className="text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('analytics.geoDistribution')}
          </CardTitle>
          <CardDescription>
            {t('analytics.geoDistributionDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-50 w-full" />
          ) : geoStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {geoStats.slice(0, 9).map((geo, index) => (
                <div
                  key={`${geo.country}-${geo.city ?? 'all'}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50"
                >
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {geo.country}
                      {geo.city && (
                        <span className="text-muted-foreground">
                          {' '}
                          / {geo.city}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Number(geo.count).toLocaleString()}{' '}
                      {t('analytics.clicks')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-50 flex items-center justify-center text-muted-foreground">
              {t('analytics.noGeoData')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
