<template>
  <div class="page">
    <div class="container" style="max-width:440px">
      <h1 class="page-title">{{ t('account.title') }}</h1>
      <p class="page-desc">{{ t('account.desc') }}</p>

      <div v-if="auth.isLoggedIn" class="panel" style="padding:20px">
        <p style="margin:0;font-weight:600">{{ auth.user?.email }}</p>
        <p class="muted" style="margin:6px 0 16px">{{ t('account.role') }}：{{ auth.user?.role }}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <NuxtLink v-if="auth.isAdmin" to="/admin" class="btn btn-primary">{{ t('account.admin') }}</NuxtLink>
          <button class="btn btn-secondary" @click="auth.logout()">{{ t('account.logout') }}</button>
        </div>
      </div>

      <div v-else class="panel" style="padding:20px">
        <p class="why">{{ t('account.why') }}</p>
        <div class="form-row">
          <label class="label">{{ t('account.email') }}</label>
          <input v-model="auth.email" type="email" class="field" placeholder="you@example.com" />
        </div>
        <div class="form-row">
          <label class="label">{{ t('account.code') }}</label>
          <div style="display:flex;gap:8px">
            <input
              v-model="auth.code"
              type="text"
              maxlength="6"
              class="field"
              :placeholder="t('account.codePh')"
              style="font-family:ui-monospace,monospace"
            />
            <button
              class="btn btn-secondary"
              :disabled="auth.loading || !auth.email"
              @click="auth.sendVerificationCode()"
            >
              {{ t('account.send') }}
            </button>
          </div>
        </div>
        <button
          class="btn btn-primary"
          style="width:100%"
          :disabled="auth.loading || auth.code.length !== 6"
          @click="auth.verifyCodeAndLogin()"
        >
          {{ t('account.login') }}
        </button>
        <p v-if="auth.message" class="ok">{{ auth.message }}</p>
        <p v-if="auth.error" class="err">{{ auth.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18n()
</script>

<style scoped>
.why {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--text-muted);
}
</style>
