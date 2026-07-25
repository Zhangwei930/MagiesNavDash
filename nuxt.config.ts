import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      // 浏览器侧默认走同源 /api（生产由 nginx 反代到 Spring Boot）
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? ''
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/api',
        changeOrigin: true
      }
    }
  },
  app: {
    head: {
      title: 'Magies',
      meta: [
        { name: 'description', content: 'Magies — Build. Connect. Ship. 简洁的产品工具生态。' },
        { name: 'theme-color', content: '#05060a' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/brand/logo-256.png' }
      ],
      htmlAttrs: { lang: 'zh-CN', 'data-theme': 'dark' }
    }
  }
})
