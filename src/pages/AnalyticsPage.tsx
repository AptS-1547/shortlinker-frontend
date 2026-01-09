import { BarChart3, Globe, TrendingUp, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AnalyticsPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: TrendingUp,
      title: t('analytics.features.clickTrends'),
      description: t('analytics.features.clickTrendsDesc'),
    },
    {
      icon: Users,
      title: t('analytics.features.visitors'),
      description: t('analytics.features.visitorsDesc'),
    },
    {
      icon: Globe,
      title: t('analytics.features.geography'),
      description: t('analytics.features.geographyDesc'),
    },
    {
      icon: BarChart3,
      title: t('analytics.features.topLinks'),
      description: t('analytics.features.topLinksDesc'),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('analytics.title')}
        description={t('analytics.description')}
      />

      {/* Coming Soon Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {t('analytics.comingSoon.title')}
          </CardTitle>
          <CardDescription>
            {t('analytics.comingSoon.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
