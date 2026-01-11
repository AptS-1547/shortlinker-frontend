import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 核心
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'react-vendor'
          }
          // Radix UI 组件库
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor'
          }
          // 工具库
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/date-fns') ||
            id.includes('node_modules/zustand') ||
            id.includes('node_modules/i18next')
          ) {
            return 'utils'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
