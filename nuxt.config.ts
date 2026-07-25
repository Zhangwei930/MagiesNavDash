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
      title: 'Magies — Build. Connect. Ship.',
      meta: [
        {
          name: 'description',
          content:
            'Magies 是独立软件产品品牌：开发工具、数据自动化、在线服务与企业应用。让复杂的软件，变得简单。'
        },
        { name: 'theme-color', content: '#05060a' },
        { property: 'og:title', content: 'Magies — Build. Connect. Ship.' },
        {
          property: 'og:description',
          content: '开发工具 · 数据自动化 · 在线服务 · 企业应用。让复杂的软件，变得简单。'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/brand/logo-256.png' }
      ],
      // data-theme is set by the inline script below, not here: unhead re-applies
      // htmlAttrs on hydration and would stomp the restored preference.
      script: [
        {
          innerHTML:
            "(function(){try{var t=localStorage.getItem('magies-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()",
          tagPosition: 'head'
        }
      ],
      htmlAttrs: { lang: 'zh-CN' }
    }
  }
})
