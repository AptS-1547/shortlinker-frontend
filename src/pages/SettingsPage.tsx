import { Languages, Monitor, Moon, Palette, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import {
  changeLanguage,
  getLanguageFlag,
  getLanguageKey,
  supportedLanguages,
  type SupportedLanguage,
} from '@/i18n'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    {
      value: 'light' as const,
      label: t('theme.light'),
      icon: Sun,
    },
    {
      value: 'dark' as const,
      label: t('theme.dark'),
      icon: Moon,
    },
    {
      value: 'system' as const,
      label: t('theme.system'),
      icon: Monitor,
    },
  ]

  const handleLanguageChange = (lang: SupportedLanguage) => {
    changeLanguage(lang)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
      />

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t('settings.theme.title')}</CardTitle>
            </div>
            <CardDescription>{t('settings.theme.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = theme === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t('settings.language.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('settings.language.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {supportedLanguages.map((lang) => {
                const isSelected = i18n.language === lang
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50',
                    )}
                  >
                    <span className="text-2xl">{getLanguageFlag(lang)}</span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {t(`langswitcher.language.${getLanguageKey(lang)}`)}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
