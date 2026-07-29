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
      title: 'Magies — Build. Automate. Transform.',
      meta: [
        {
          name: 'description',
          content:
            'Magies 是一套强大的工具套件，为创作者、开发者与企业打造 AI 时代的生产力体验。开发工具 · 数据自动化 · 在线服务 · 企业应用。'
        },
        { name: 'theme-color', content: '#05060a' },
        { property: 'og:title', content: 'Magies — Build. Automate. Transform.' },
        {
          property: 'og:description',
          content: 'AI Native 产品生态：开发工具 · 数据自动化 · 在线服务 · 企业应用。'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/brand/apple-touch-icon.png' }
      ],
      htmlAttrs: { lang: 'zh-CN' }
    }
  }
})
