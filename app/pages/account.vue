<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">账号中心</h1>
      
      <div v-if="authStore.isLoggedIn" class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-4xl">👋</div>
          <div>
            <div class="text-2xl font-semibold">欢迎回来，{{ authStore.user?.email || '用户' }}！</div>
            <div class="text-green-600">登录状态 • 2026-07-24</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <button @click="logout" class="w-full py-4 border border-gray-300 hover:bg-gray-50 rounded-2xl font-medium transition-colors">退出登录</button>
            <div class="text-xs text-gray-400">密码重置 / 安全设置将在 Phase3 中添加</div>
          </div>
          
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
            <p class="font-medium mb-2">最近活动</p>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• 2026-07-23 登录成功（邮箱验证）</li>
              <li>• 2026-07-22 下载 v1.0 签名包</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else class="max-w-md mx-auto bg-white rounded-3xl p-10 shadow-xl">
        <h2 class="text-2xl font-bold mb-6">登录 / 注册</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">邮箱</label>
            <input v-model="email" type="email" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
          </div>
          <div v-if="authStore.verificationSent" class="space-y-3">
            <div class="flex gap-3">
              <input v-model="code" type="text" maxlength="6" class="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-mono text-center" placeholder="123456" />
              <button @click="sendVerificationCode" class="px-6 bg-gray-100 hover:bg-gray-200 rounded-2xl text-sm font-medium transition-colors">重新发送</button>
            </div>
            <p class="text-xs text-gray-500">验证码已发送（有效期 5 分钟）</p>
          </div>
          <button @click="login" :disabled="!code || code.length !== 6" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-medium disabled:bg-gray-300 transition-all" :class="{ 'opacity-70': !code || code.length !== 6 }">
            确认登录 / 注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const code = ref('')

const sendVerificationCode = () => {
  authStore.sendVerificationCode()
}

const login = () => {
  authStore.verifyCodeAndLogin()
}

const logout = () => {
  authStore.isLoggedIn = false
  authStore.verificationSent = false
  authStore.user = null
  alert('已退出登录')
}
</script>
