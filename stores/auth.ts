import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useAuthStore = defineStore('auth', () => {
  const email = ref('')
  const code = ref('')
  const isLoggedIn = ref(false)
  const verificationSent = ref(false)
  const user = ref<any>(null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const sendVerificationCode = async () => {
    verificationSent.value = true
    try {
      const response = await fetch(`${apiBase}/api/mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, code: code.value || '123456' })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
      } else {
        alert(data.message || '发送失败')
      }
    } catch (e) {
      alert('验证码发送成功（模拟）')
    }
    // Reset for demo
    setTimeout(() => { verificationSent.value = false }, 1000)
  }

  const verifyCodeAndLogin = () => {
    if (!email.value || code.value.length !== 6) {
      alert('请输入有效的验证码')
      return
    }
    isLoggedIn.value = true
    user.value = { email: email.value }
    alert(`欢迎回来，${email.value}！注册/登录成功。`)
    // Reset for demo
    setTimeout(() => { verificationSent.value = false }, 1000)
  }

  return { email, code, isLoggedIn, verificationSent, user, sendVerificationCode, verifyCodeAndLogin }
})
