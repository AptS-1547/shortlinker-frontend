import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Settings,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useHealthStore } from '@/stores/healthStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
const mainNavItems = [
  {
    path: '/dashboard',
    label: 'layout.navigation.dashboard',
    icon: LayoutDashboard,
  },
  { path: '/links', label: 'layout.navigation.links', icon: LinkIcon },
  { path: '/analytics', label: 'layout.navigation.analytics', icon: BarChart3 },
  { path: '/settings', label: 'layout.navigation.settings', icon: Settings },
]

interface AppSidebarProps {
  onOpenHealthModal?: () => void
}

export default function AppSidebar({ onOpenHealthModal }: AppSidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const healthData = useHealthStore((state) => state.status)
  const { state } = useSidebar()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getHealthColor = () => {
    if (!healthData) return 'bg-amber-400'
    return healthData.status === 'healthy' ? 'bg-emerald-400' : 'bg-red-400'
  }

  const getHealthText = () => {
    if (!healthData) return t('layout.health.unknown')
    return healthData.status === 'healthy'
      ? t('layout.health.healthy')
      : t('layout.health.unhealthy')
  }

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div
          className={cn(
            'flex items-center gap-3 py-3 overflow-hidden',
            isCollapsed ? 'justify-center px-0' : 'px-2',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LinkIcon className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">
                ShortLinker
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {t('layout.subtitle')}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && t('layout.navigation.title')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={t(item.label)}
                    >
                      <NavLink to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{t(item.label)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && t('layout.system.title')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onOpenHealthModal}
                  tooltip={t('health.title')}
                >
                  <div className="relative">
                    <Activity className="h-4 w-4" />
                    <span
                      className={cn(
                        'absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full',
                        getHealthColor(),
                      )}
                    />
                  </div>
                  <span>{getHealthText()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t('layout.logout')}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('layout.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
