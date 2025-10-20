<template>
  <div class="space-y-6">
    <!-- 页面标题 - 现代化设计 -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-xl"
      ></div>
      <div class="relative p-4">
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent"
        >
          {{ $t('analytics.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('analytics.description') }}</p>
      </div>
    </div>

    <!-- 统计卡片 - 现代化设计 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        class="group relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div class="relative flex items-center">
          <div
            class="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
          >
            <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-3">
            <h3
              class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ $t('analytics.totalLinks') }}
            </h3>
            <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
              {{ totalLinks }}
            </p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {{ $t('analytics.activeLinks') }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="group relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div class="relative flex items-center">
          <div
            class="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
          >
            <EyeIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="ml-3">
            <h3
              class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ $t('analytics.totalClicks') }}
            </h3>
            <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
              {{ totalClicks }}
            </p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {{ $t('analytics.recentActivity') }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="group relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div class="relative flex items-center">
          <div
            class="p-3 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
          >
            <ChartBarIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div class="ml-3">
            <h3
              class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ $t('analytics.thisWeek') }}
            </h3>
            <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
              {{ weeklyClicks }}
            </p>
            <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              {{ $t('analytics.clicks') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 链接活动图表 - 现代化设计 -->
    <div
      class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 mb-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl"
      ></div>
      <div class="relative">
        <h2
          class="text-lg font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-gray-100 dark:to-indigo-300 bg-clip-text text-transparent"
        >
          {{ $t('analytics.recentActivityTitle') }}
        </h2>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin mx-auto mb-4">
            <SpinnerIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('analytics.loadingActivity') }}</p>
        </div>

        <div v-else-if="recentLinks.length > 0" class="space-y-3">
          <div
            v-for="(link, index) in recentLinks"
            :key="link.code"
            class="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/40 dark:from-gray-700/50 dark:to-gray-600/30 rounded-lg hover:from-indigo-50/80 hover:to-purple-50/40 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-200/70 dark:hover:border-indigo-700/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300"
              >
                <span class="text-indigo-700 dark:text-indigo-400 font-bold text-xs">{{
                  index + 1
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <button
                    @click="copyShortLink(link.code)"
                    :class="[
                      'font-mono text-xs px-2 py-1 rounded border shadow-sm transition-all duration-300 hover:shadow-md',
                      copiedLink === link.code
                        ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 scale-105'
                        : link.password
                          ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 text-amber-800 dark:text-amber-300 border-amber-200/50 dark:border-amber-700/50 hover:from-amber-200 hover:to-amber-100 hover:border-amber-300'
                          : 'bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/20 text-indigo-800 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-700/50 hover:from-indigo-200 hover:to-indigo-100 hover:border-indigo-300',
                    ]"
                    :title="
                      copiedLink === link.code
                        ? $t('common.copied')
                        : link.password
                          ? $t('links.copyPasswordProtectedLink')
                          : $t('links.copyLinkTitle')
                    "
                  >
                    <div class="flex items-center gap-1">
                      <span class="font-bold">{{ link.code }}</span>
                      <span
                        v-if="link.password && copiedLink !== link.code"
                        class="text-amber-600 dark:text-amber-400 text-xs"
                        >🔒</span
                      >
                      <CheckCircleIcon
                        v-if="copiedLink === link.code"
                        className="w-3 h-3 text-emerald-700 dark:text-emerald-400"
                      />
                      <CopyIcon
                        v-else
                        className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity"
                      />
                    </div>
                  </button>
                  <!-- 密码保护标识 -->
                  <span
                    v-if="link.password"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50"
                    :title="$t('links.passwordProtected')"
                  >
                    🔒
                  </span>
                  <span class="text-gray-400 dark:text-gray-500 text-sm">→</span>
                  <span
                    class="text-gray-700 dark:text-gray-300 truncate max-w-md font-medium text-sm"
                  >
                    {{ link.target }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('analytics.created') }}: {{ formatDate(link.created_at) }}
                  <span v-if="link.expires_at" class="ml-2">
                    • {{ $t('analytics.expires') }}: {{ formatDate(link.expires_at) }}
                  </span>
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ $t('analytics.clicks') }}
              </p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                {{ link.click_count || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div
            class="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
          >
            <ChartBarIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
            {{ $t('analytics.noActivityYet') }}
          </h3>
          <p class="text-gray-700 dark:text-gray-400 mb-3">{{ $t('analytics.noActivityDesc') }}</p>
          <router-link
            to="/links"
            class="inline-flex items-center px-3 py-2 bg-indigo-500 dark:bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {{ $t('links.createFirstLink') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 链接状态分布 - 现代化设计 -->
    <div
      class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 mb-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30 dark:from-green-900/10 dark:via-blue-900/10 dark:to-purple-900/10 rounded-xl"
      ></div>
      <div class="relative">
        <h2
          class="text-lg font-bold mb-4 bg-gradient-to-r from-gray-900 to-emerald-900 dark:from-gray-100 dark:to-emerald-300 bg-clip-text text-transparent"
        >
          {{ $t('analytics.linkStatusDistribution') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="group relative p-4 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-700/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300/70 dark:hover:border-emerald-600/50"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-emerald-50/10 dark:from-emerald-900/10 dark:to-emerald-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p
                    class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide"
                  >
                    {{ $t('analytics.activeLinksCard') }}
                  </p>
                  <p class="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                    {{ activeLinksCount }}
                  </p>
                </div>
                <div
                  class="p-2 bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-800/50 dark:to-emerald-700/30 rounded-lg shadow-sm"
                >
                  <CheckCircleIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
              </div>
              <div class="mt-3">
                <div class="bg-emerald-200/70 dark:bg-emerald-800/30 rounded-full h-2 shadow-inner">
                  <div
                    class="bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 h-2 rounded-full transition-all duration-700 shadow-sm"
                    :style="{ width: `${activeLinksPercentage}%` }"
                  ></div>
                </div>
                <p class="text-xs text-emerald-800 dark:text-emerald-300 mt-1 font-medium">
                  {{ activeLinksPercentage.toFixed(1) }}% {{ $t('analytics.ofTotal') }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="group relative p-4 bg-gradient-to-br from-red-50/80 to-red-100/40 dark:from-red-900/20 dark:to-red-800/10 rounded-lg border-2 border-red-200/50 dark:border-red-700/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-red-300/70 dark:hover:border-red-600/50"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-100/20 to-red-50/10 dark:from-red-900/10 dark:to-red-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p
                    class="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wide"
                  >
                    {{ $t('analytics.expiredLinksCard') }}
                  </p>
                  <p class="text-xl font-bold text-red-900 dark:text-red-200 mt-1">
                    {{ expiredLinksCount }}
                  </p>
                </div>
                <div
                  class="p-2 bg-gradient-to-br from-red-200 to-red-100 dark:from-red-800/50 dark:to-red-700/30 rounded-lg shadow-sm"
                >
                  <ClockIcon className="w-5 h-5 text-red-700 dark:text-red-400" />
                </div>
              </div>
              <div class="mt-3">
                <div class="bg-red-200/70 dark:bg-red-800/30 rounded-full h-2 shadow-inner">
                  <div
                    class="bg-gradient-to-r from-red-500 to-red-400 dark:from-red-400 dark:to-red-300 h-2 rounded-full transition-all duration-700 shadow-sm"
                    :style="{ width: `${expiredLinksPercentage}%` }"
                  ></div>
                </div>
                <p class="text-xs text-red-800 dark:text-red-300 mt-1 font-medium">
                  {{ expiredLinksPercentage.toFixed(1) }}% {{ $t('analytics.ofTotal') }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="group relative p-4 bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border-2 border-indigo-200/50 dark:border-indigo-700/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300/70 dark:hover:border-indigo-600/50"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-indigo-50/10 dark:from-indigo-900/10 dark:to-indigo-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p
                    class="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide"
                  >
                    {{ $t('analytics.permanentLinksCard') }}
                  </p>
                  <p class="text-xl font-bold text-indigo-900 dark:text-indigo-200 mt-1">
                    {{ permanentLinksCount }}
                  </p>
                </div>
                <div
                  class="p-2 bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-800/50 dark:to-indigo-700/30 rounded-lg shadow-sm"
                >
                  <LinkIcon className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                </div>
              </div>
              <div class="mt-3">
                <div class="bg-indigo-200/70 dark:bg-indigo-800/30 rounded-full h-2 shadow-inner">
                  <div
                    class="bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300 h-2 rounded-full transition-all duration-700 shadow-sm"
                    :style="{ width: `${permanentLinksPercentage}%` }"
                  ></div>
                </div>
                <p class="text-xs text-indigo-800 dark:text-indigo-300 mt-1 font-medium">
                  {{ permanentLinksPercentage.toFixed(1) }}% {{ $t('analytics.ofTotal') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 额外统计信息 -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="group relative p-4 bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-900/20 dark:to-amber-800/10 rounded-lg border-2 border-amber-200/50 dark:border-amber-700/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300/70 dark:hover:border-amber-600/50"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-amber-50/10 dark:from-amber-900/10 dark:to-amber-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p
                    class="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide"
                  >
                    {{ $t('links.passwordProtected') }}
                  </p>
                  <p class="text-xl font-bold text-amber-900 dark:text-amber-200 mt-1">
                    {{ passwordProtectedCount }}
                  </p>
                </div>
                <div
                  class="p-2 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/50 dark:to-amber-700/30 rounded-lg shadow-sm"
                >
                  <span class="text-lg">🔒</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="bg-amber-200/70 dark:bg-amber-800/30 rounded-full h-2 shadow-inner">
                  <div
                    class="bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-400 dark:to-amber-300 h-2 rounded-full transition-all duration-700 shadow-sm"
                    :style="{
                      width: `${totalLinks > 0 ? (passwordProtectedCount / totalLinks) * 100 : 0}%`,
                    }"
                  ></div>
                </div>
                <p class="text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium">
                  {{
                    totalLinks > 0 ? ((passwordProtectedCount / totalLinks) * 100).toFixed(1) : 0
                  }}% {{ $t('analytics.ofTotal') }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="group relative p-4 bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg border-2 border-purple-200/50 dark:border-purple-700/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-purple-300/70 dark:hover:border-purple-600/50"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-purple-50/10 dark:from-purple-900/10 dark:to-purple-800/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p
                    class="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wide"
                  >
                    {{ $t('analytics.averageClicks') }}
                  </p>
                  <p class="text-xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                    {{ averageClicksPerLink.toFixed(1) }}
                  </p>
                </div>
                <div
                  class="p-2 bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-800/50 dark:to-purple-700/30 rounded-lg shadow-sm"
                >
                  <ChartBarIcon className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
              </div>
              <p class="text-xs text-purple-800 dark:text-purple-300 mt-1 font-medium">
                {{ $t('analytics.clicksPerLink') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示信息 - 现代化设计 -->
    <div
      class="relative bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-purple-50/80 dark:from-indigo-900/20 dark:via-blue-900/15 dark:to-purple-900/20 border-2 border-indigo-200/50 dark:border-indigo-700/30 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300/70 dark:hover:border-indigo-600/50"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-purple-100/10 dark:from-indigo-900/10 dark:to-purple-900/5 rounded-lg"
      ></div>
      <div class="relative flex items-start gap-3">
        <div
          class="p-1.5 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-lg shadow-sm"
        >
          <InfoIcon className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">
            {{ $t('analytics.analyticsFeatures') }}
          </h4>
          <p class="text-indigo-800 dark:text-indigo-300 leading-relaxed text-sm">
            {{ $t('analytics.analyticsFeaturesDesc') }}
          </p>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 Toast -->
    <div
      v-if="showCopyToast"
      class="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out border border-emerald-400/50 dark:border-emerald-500/50"
      :class="
        showCopyToast
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      "
    >
      <div class="flex items-start gap-3">
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-bold text-lg">{{ $t('links.linkCopied') }}</div>
          <div v-if="copiedLinkHasPassword" class="text-emerald-100 text-sm mt-1">
            {{ $t('links.passwordParameterAdded') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLinksStore } from '@/stores/links'
import { storeToRefs } from 'pinia'
import {
  LinkIcon,
  EyeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  SpinnerIcon,
  InfoIcon,
  CopyIcon,
} from '@/components/icons'

const { t } = useI18n()
const linksStore = useLinksStore()
const { links, loading } = storeToRefs(linksStore)
const { fetchLinks } = linksStore

// 复制相关状态
const copiedLink = ref<string | null>(null)
const copiedLinkHasPassword = ref<boolean>(false)
const showCopyToast = ref(false)

const totalLinks = computed(() => links.value.length)

const totalClicks = computed(() => {
  return links.value.reduce((total, link) => total + (link.click_count || 0), 0)
})

const recentLinks = computed(() => {
  return [...links.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 7)
})

const recentLinksCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return links.value.filter((link) => new Date(link.created_at) > oneWeekAgo).length
})

const weeklyClicks = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return links.value
    .filter((link) => new Date(link.created_at) > oneWeekAgo)
    .reduce((total, link) => total + (link.click_count || 0), 0)
})

const activeLinksCount = computed(() => {
  const now = new Date()
  return links.value.filter((link) => !link.expires_at || new Date(link.expires_at) > now).length
})

const expiredLinksCount = computed(() => {
  const now = new Date()
  return links.value.filter((link) => link.expires_at && new Date(link.expires_at) <= now).length
})

const permanentLinksCount = computed(() => {
  return links.value.filter((link) => !link.expires_at).length
})

const activeLinksPercentage = computed(() => {
  return totalLinks.value > 0 ? (activeLinksCount.value / totalLinks.value) * 100 : 0
})

const expiredLinksPercentage = computed(() => {
  return totalLinks.value > 0 ? (expiredLinksCount.value / totalLinks.value) * 100 : 0
})

const permanentLinksPercentage = computed(() => {
  return totalLinks.value > 0 ? (permanentLinksCount.value / totalLinks.value) * 100 : 0
})

const topClickedLinks = computed(() => {
  return [...links.value]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 5)
    .filter((link) => (link.click_count || 0) > 0)
})

const averageClicksPerLink = computed(() => {
  return totalLinks.value > 0 ? totalClicks.value / totalLinks.value : 0
})

const passwordProtectedCount = computed(() => {
  return links.value.filter((link) => link.password).length
})

function formatDate(dateString: string) {
  // 确保正确解析 RFC3339 格式的时间
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function copyShortLink(code: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin

  // 查找对应的链接以检查是否有密码保护
  const link = links.value.find((l) => l.code === code)
  const hasPassword = link?.password

  // 如果有密码保护，添加 ?password=实际密码 参数
  const shortUrl = hasPassword
    ? `${baseUrl}/${code}?password=${link.password}`
    : `${baseUrl}/${code}`

  try {
    await navigator.clipboard.writeText(shortUrl)

    // 设置当前复制的链接和密码状态
    copiedLink.value = code
    copiedLinkHasPassword.value = !!hasPassword
    showCopyToast.value = true

    // 2秒后重置状态
    setTimeout(() => {
      copiedLink.value = null
      copiedLinkHasPassword.value = false
    }, 2000)

    // 3秒后隐藏 Toast
    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)

    console.log('Link copied to clipboard:', shortUrl)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

onMounted(() => {
  fetchLinks()
})
</script>
