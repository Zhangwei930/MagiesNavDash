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
      title: 'Magies Hub — 统一产品门户',
      meta: [
        { name: 'description', content: 'Magies Hub Enterprise：产品中心、账号中心、下载中心、后台管理与邮件中心。' },
        { name: 'theme-color', content: '#030712' }
      ],
      htmlAttrs: { lang: 'zh-CN' }
    }
  }
})
