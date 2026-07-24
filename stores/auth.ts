import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const email = ref('')
  const code = ref('')
  const isLoggedIn = ref(false)
  const verificationSent = ref(false)
  const user = ref<any>(null)

  const sendVerificationCode = () => {
    verificationSent.value = true
    // Simulate API call
    setTimeout(() => {
      alert('验证码已发送！有效期 5 分钟。')
    }, 500)
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
