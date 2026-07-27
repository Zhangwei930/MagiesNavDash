import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type AuthUser = {
  id: number
  email: string
  displayName: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const user = ref<AuthUser | null>(null)
  const email = ref('')
  const code = ref('')
  const loading = ref(false)
  const message = ref('')
  const error = ref('')
  const codeSent = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  if (import.meta.client) {
    const saved = localStorage.getItem('magies_auth')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        token.value = parsed.token || ''
        user.value = parsed.user || null
      } catch {
        localStorage.removeItem('magies_auth')
      }
    }
  }

  function persist() {
    if (!import.meta.client) return
    if (token.value && user.value) {
      localStorage.setItem('magies_auth', JSON.stringify({ token: token.value, user: user.value }))
    } else {
      localStorage.removeItem('magies_auth')
    }
  }

  async function sendVerificationCode() {
    loading.value = true
    error.value = ''
    message.value = ''
    try {
      const { api } = useApi()
      const data = await api<{ success: boolean; message: string }>('/api/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.value })
      })
      codeSent.value = true
      message.value = data.message
    } catch (e: any) {
      error.value = e.message || '发送失败'
      codeSent.value = false
    } finally {
      loading.value = false
    }
  }

  async function verifyCodeAndLogin() {
    loading.value = true
    error.value = ''
    message.value = ''
    try {
      const { api } = useApi()
      const data = await api<{
        success: boolean
        message: string
        token: string
        user: AuthUser
      }>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email: email.value, code: code.value })
      })
      token.value = data.token
      user.value = data.user
      message.value = data.message
      codeSent.value = false
      code.value = ''
      persist()
    } catch (e: any) {
      error.value = e.message || '登录失败'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    codeSent.value = false
    code.value = ''
    message.value = '已退出登录'
    persist()
  }

  return {
    token,
    user,
    email,
    code,
    loading,
    message,
    error,
    codeSent,
    isLoggedIn,
    isAdmin,
    sendVerificationCode,
    verifyCodeAndLogin,
    logout
  }
})
