import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { config } from '@/config'

// 路由懒加载
const LoginView = () => import('@/views/LoginView.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const LinksView = () => import('@/views/LinksView.vue')
const AnalyticsView = () => import('@/views/AnalyticsView.vue')

const router = createRouter({
  history: createWebHistory(config.basePath),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'links',
          name: 'links',
          component: LinksView,
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: AnalyticsView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 如果是需要认证的路由，先检查认证状态
  if (to.meta.requiresAuth) {
    // 只在第一次访问时检查认证状态（避免每次路由都调用 API）
    if (!authStore.isAuthenticated && !authStore.isChecking) {
      // 通过后端验证 Cookie 是否有效
      const isValid = await authStore.checkAuthStatus()
      if (!isValid) {
        return { path: '/login' }
      }
    } else if (!authStore.isAuthenticated) {
      return { path: '/login' }
    }
  }

  // 如果已登录，不允许访问登录页
  if (to.path === '/login' && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }

  // 明确返回 undefined 表示允许导航
  return undefined
})

export default router
