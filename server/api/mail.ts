import type { APIRoute } from 'nitro/types'

export default <APIRoute> {
  async post({ event }) {
    const { email, code } = await event.req.json()
    
    if (!email || !code || code.length !== 6) {
      return { code: 400, body: { success: false, message: '验证码格式错误' } }
    }
    
    console.log(`[Mail Log] ${new Date().toISOString()} | ${email} | ${code} | 验证码邮件发送成功 (模拟 Mail Gateway)`)
    
    return { 
      code: 200, 
      body: { 
        success: true, 
        message: '验证码邮件已发送（模拟 Mail Gateway + Google SMTP）',
        template: `【Magies Hub】您的验证码是：${code}\n有效期：5分钟\n如非本人操作，请忽略此邮件。`
      } 
    }
  }
}
