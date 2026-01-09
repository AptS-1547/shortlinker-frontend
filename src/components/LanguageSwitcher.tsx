import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  changeLanguage,
  getLanguageDisplayName,
  getLanguageFlag,
  getLanguageKey,
  supportedLanguages,
  type SupportedLanguage,
} from '@/i18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const handleChangeLanguage = (newLocale: SupportedLanguage) => {
    changeLanguage(newLocale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={t('langswitcher.title')}>
          <Languages className="h-4 w-4" />
          <span>{getLanguageDisplayName(i18n.language)}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-40">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleChangeLanguage(lang)}
            className={i18n.language === lang ? 'bg-accent' : ''}
          >
            <span>{getLanguageFlag(lang)}</span>
            <span>{t(`langswitcher.language.${getLanguageKey(lang)}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
