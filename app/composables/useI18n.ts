export type Locale = 'zh' | 'en'

const messages = {
  zh: {
    'nav.lang': 'EN',
    'nav.theme': '切换主题',
    'nav.menu': '菜单',
    'nav.home': '首页',
    'nav.products': '产品',
    'nav.download': '下载',
    'nav.about': '关于',
    'site.hub': 'Magies Hub',
    'site.hubDesc': '产品官网与下载入口',
    'site.terminal': 'MagiesTerminal',
    'site.terminalDesc': 'AI 驱动的 SSH 工作空间',
    'site.nav': '导航站',
    'site.navDesc': '统一入口，一键到达常用系统',
    'footer.blurb': '一套彼此独立、又在同一门户汇合的产品。',
    'footer.site': '站点',
    'footer.ecosystem': '生态',
    'footer.resources': '资源',
    'footer.getTerminal': '下载 MagiesTerminal',
    'footer.allProducts': '全部产品',
    'footer.copy': '版权所有',
    'home.badge': '产品生态 · 统一入口',
    'home.lead': 'Magies 是一套简洁的产品工具生态 —— 终端、导航与业务应用，统一入口、统一账号。',
    'home.browse': '浏览产品',
    'home.sitesLabel': '全站入口',
    'home.sitesTitle': '所有 Magies 站点',
    'home.sitesDesc': '每个站点独立运行，从这里都能直接进去。',
    'home.productsLabel': '产品',
    'home.productsTitle': '产品矩阵',
    'home.productsDesc': '挑一个入口，直接开始。',
    'home.loading': '加载中…',
    'home.featured': '重点产品',
    'home.terminalTag': '终端与运维入口',
    'home.terminalDesc': '远程连接与日常运维的统一工作台。少切换、少记忆，把常用能力收在一个入口。',
    'home.terminalF1': '一键进入运维环境',
    'home.terminalF2': '与账号体系打通',
    'home.terminalF3': '持续迭代的终端体验',
    'home.openTerminal': '打开 Terminal',
    'home.download': '下载',
    'home.philosophyLabel': '理念',
    'home.philosophyTitle': '少一点噪音，多一点完成。',
    'home.philosophyBody':
      'Magies 相信工具应该消失在工作流里。产品彼此独立，又能在同一门户汇合 —— 让你十秒内知道去哪，而不是先学一整套系统。',
    'products.title': '产品',
    'products.loading': '加载中…',
    'products.empty': '暂无产品',
    'products.all': '全部',
    'products.open': '打开',
    'products.detail': '详情',
    'detail.open': '打开产品',
    'detail.features': '能力',
    'detail.release': '版本与下载',
    'detail.download': '下载',
    'download.title': '下载中心',
    'download.desc': '各产品最新稳定版与签名信息',
    'download.product': '产品',
    'download.version': '版本',
    'download.notes': '说明',
    'download.btn': '下载',
    'download.loading': '加载中…',
    'download.empty': '暂无发布版本',
    'account.title': '账号中心',
    'account.desc': '邮箱验证码登录 / 注册',
    'account.role': '角色',
    'account.admin': '后台管理',
    'account.logout': '退出登录',
    'account.email': '邮箱',
    'account.code': '验证码',
    'account.send': '发送',
    'account.login': '登录 / 注册',
    'account.codePh': '6 位',
    'about.title': '关于 Magies',
    'about.desc': '少一点噪音，多一点完成。',
    'about.body':
      'Magies 提供一组可独立使用、又能在同一门户汇合的产品：Terminal、Nav、业务应用与账号下载体系。目标不是堆功能，而是让你快速找到入口、完成工作。',
    'about.browse': '浏览产品',
    'about.home': '返回首页'
  },
  en: {
    'nav.lang': '中文',
    'nav.theme': 'Toggle theme',
    'nav.menu': 'Menu',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.download': 'Downloads',
    'nav.about': 'About',
    'site.hub': 'Magies Hub',
    'site.hubDesc': 'Product site and downloads',
    'site.terminal': 'MagiesTerminal',
    'site.terminalDesc': 'AI-powered SSH workspace',
    'site.nav': 'Nav',
    'site.navDesc': 'One entry to every system you use',
    'footer.blurb': 'Independent products that meet in one portal.',
    'footer.site': 'Site',
    'footer.ecosystem': 'Ecosystem',
    'footer.resources': 'Resources',
    'footer.getTerminal': 'Get MagiesTerminal',
    'footer.allProducts': 'All products',
    'footer.copy': 'All rights reserved',
    'home.badge': 'One portal for every product',
    'home.lead':
      'Magies is a simple product toolkit — terminal, navigation, and business apps, with one entry and one account.',
    'home.browse': 'Browse products',
    'home.sitesLabel': 'All sites',
    'home.sitesTitle': 'Every Magies site',
    'home.sitesDesc': 'Each runs on its own — reach any of them from here.',
    'home.productsLabel': 'Products',
    'home.productsTitle': 'Product suite',
    'home.productsDesc': 'Pick an entry and go.',
    'home.loading': 'Loading…',
    'home.featured': 'Featured',
    'home.terminalTag': 'Terminal & ops',
    'home.terminalDesc':
      'A unified workspace for remote access and daily ops. Fewer switches, less to remember.',
    'home.terminalF1': 'One-click ops entry',
    'home.terminalF2': 'Tied into the account system',
    'home.terminalF3': 'Continuously improved terminal UX',
    'home.openTerminal': 'Open Terminal',
    'home.download': 'Download',
    'home.philosophyLabel': 'Philosophy',
    'home.philosophyTitle': 'Less noise. More done.',
    'home.philosophyBody':
      'Magies believes tools should disappear into your workflow. Products stay independent, yet meet in one portal — so you know where to go in ten seconds, not after learning a whole system.',
    'products.title': 'Products',
    'products.loading': 'Loading…',
    'products.empty': 'No products yet',
    'products.all': 'All',
    'products.open': 'Open',
    'products.detail': 'Details',
    'detail.open': 'Open product',
    'detail.features': 'Capabilities',
    'detail.release': 'Release',
    'detail.download': 'Download',
    'download.title': 'Downloads',
    'download.desc': 'Latest stable builds and signatures',
    'download.product': 'Product',
    'download.version': 'Version',
    'download.notes': 'Notes',
    'download.btn': 'Download',
    'download.loading': 'Loading…',
    'download.empty': 'No releases yet',
    'account.title': 'Account',
    'account.desc': 'Sign in / register with email code',
    'account.role': 'Role',
    'account.admin': 'Admin',
    'account.logout': 'Sign out',
    'account.email': 'Email',
    'account.code': 'Code',
    'account.send': 'Send',
    'account.login': 'Sign in / Register',
    'account.codePh': '6 digits',
    'about.title': 'About Magies',
    'about.desc': 'Less noise. More done.',
    'about.body':
      'Magies offers independent products that also meet in one portal: Terminal, Nav, business apps, and account/download. The goal is not feature piles — it is finding the door fast and finishing the work.',
    'about.browse': 'Browse products',
    'about.home': 'Back home'
  }
} as const

export type MsgKey = keyof typeof messages.zh

export function useI18n() {
  const locale = useState<Locale>('locale', () => 'zh')

  function t(key: MsgKey): string {
    return messages[locale.value][key] || messages.zh[key] || key
  }

  function setLocale(next: Locale) {
    locale.value = next
    if (import.meta.client) {
      localStorage.setItem('magies-locale', next)
      document.documentElement.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en')
    }
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh' ? 'en' : 'zh')
  }

  function initLocale() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('magies-locale') as Locale | null
    if (saved === 'zh' || saved === 'en') setLocale(saved)
    else setLocale('zh')
  }

  return { locale, t, setLocale, toggleLocale, initLocale }
}
