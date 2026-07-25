<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Magies Hub</h1>
            <p class="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>
        <nav class="flex gap-8 text-sm">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors">首页</NuxtLink>
          <NuxtLink to="/account" class="hover:text-blue-600 transition-colors">账号中心</NuxtLink>
          <NuxtLink to="/download" class="hover:text-blue-600 transition-colors">下载中心</NuxtLink>
          <NuxtLink to="/admin" class="hover:text-blue-600 transition-colors">后台管理</NuxtLink>
        </nav>
        <div class="flex gap-4">
          <button @click="showLogin = !showLogin" class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">登录 / 注册</button>
          <button class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">立即体验</button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-6 py-20 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-5xl font-bold text-gray-900 mb-6 leading-tight">统一产品门户</h2>
        <p class="text-xl text-gray-600 mb-10">整合官网、账号、下载、后台、文档、邮件中心，一站式管理您的产品生态。</p>
        <div class="flex justify-center gap-4">
          <button @click="scrollToDownload" class="px-8 py-4 bg-blue-600 text-white rounded-2xl text-lg font-semibold hover:bg-blue-700 transition-all active:scale-95">开始使用</button>
          <button @click="showDemo" class="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-2xl text-lg font-medium transition-all">观看演示</button>
        </div>
      </div>
    </section>

    <!-- Product Center Preview -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <h3 class="text-3xl font-semibold text-gray-900 mb-8">产品中心</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Product card 1 -->
          <div class="bg-gray-50 p-6 rounded-3xl hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">📦</div>
            <h4 class="font-bold text-xl mb-1">产品模块</h4>
            <p class="text-gray-600">展示、详情、版本下载、自动更新</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-3xl hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">🔗</div>
            <h4 class="font-bold text-xl mb-1">版本管理</h4>
            <p class="text-gray-600">支持多版本、签名验证、自动更新</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-3xl hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">📊</div>
            <h4 class="font-bold text-xl mb-1">统计分析</h4>
            <p class="text-gray-600">访问量、下载统计、用户行为分析</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Account & Email Section -->
    <section class="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-3xl font-semibold mb-4">统一账号中心</h3>
          <p class="text-gray-600 mb-6">一键注册、登录、找回密码、邮件验证码</p>
          <div class="space-y-4">
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">✓</div>
              <div>邮箱注册 / 手机号绑定</div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">✓</div>
              <div>邮件验证码（5分钟有效）</div>
            </div>
          </div>
          <button @click="showLoginModal = true" class="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium hover:brightness-110 transition-all">立即注册 / 登录</button>
        </div>
        <div class="bg-white p-8 rounded-3xl shadow-xl">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-2xl text-4xl mb-4">✉️</div>
            <h4 class="text-xl font-semibold">邮件中心</h4>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 text-sm">
            <p class="font-medium mb-3">验证码邮件示例：</p>
            <div class="bg-white border border-dashed border-gray-200 p-4 rounded-xl font-mono text-xs leading-relaxed">
              【Magies Hub】您的验证码是：<br>
              <span class="font-bold text-blue-600">123456</span><br>
              有效期：5分钟<br><br>
              如非本人操作，请忽略此邮件。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Center -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <h3 class="text-3xl font-semibold text-gray-900 mb-8">下载中心</h3>
      <div class="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <div class="flex justify-between items-end mb-8">
          <div>
            <div class="uppercase tracking-widest text-blue-600 text-sm font-medium mb-1">最新版本 v1.0</div>
            <div class="text-4xl font-bold">Magies Hub</div>
            <div class="text-gray-500">签名验证已启用</div>
          </div>
          <button @click="downloadProduct" class="px-10 py-4 bg-black text-white rounded-2xl text-lg font-semibold hover:bg-gray-900 transition-all flex items-center gap-3">
            <span>立即下载</span>
            <span class="text-xl">↓</span>
          </button>
        </div>
        <div class="grid grid-cols-3 gap-8 text-sm">
          <div>签名文件：<span class="font-mono bg-gray-100 px-2 py-0.5 rounded">magies-hub-1.0.sig</span></div>
          <div>支持格式：Windows, macOS, Linux</div>
          <div>更新时间：2026-07-24</div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-6 text-sm">
        <div class="flex justify-between">
          <div>© 2026 Magies Hub Enterprise. 保留所有权利。</div>
          <div class="flex gap-6">
            <a href="#" class="hover:text-white">隐私政策</a>
            <a href="#" class="hover:text-white">支持中心</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <div v-if="showLogin" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-6">
      <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden">
        <div class="p-8">
          <h3 class="text-2xl font-bold mb-6">登录 / 注册</h3>
          <div class="space-y-6">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">邮箱地址</label>
              <input v-model="email" type="email" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">验证码</label>
              <div class="flex gap-3">
                <input v-model="code" type="text" maxlength="6" class="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-mono text-center" placeholder="123456" />
                <button @click="sendVerificationCode" class="px-6 bg-gray-100 hover:bg-gray-200 rounded-2xl text-sm font-medium">发送验证码</button>
              </div>
            </div>
          </div>
          <button @click="login" class="mt-8 w-full py-3.5 bg-blue-600 text-white rounded-2xl font-medium">确认登录 / 注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const showLogin = ref(false)
const showLoginModal = ref(false)
const showDemo = () => alert('演示功能即将上线！')
const scrollToDownload = () => {
  document.querySelector('section:last-of-type')?.scrollIntoView({ behavior: 'smooth' })
}
const downloadProduct = () => alert('下载功能已启用（模拟）')

const sendVerificationCode = () => {
  authStore.sendVerificationCode()
}

const login = () => {
  authStore.verifyCodeAndLogin()
  showLogin.value = false
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
