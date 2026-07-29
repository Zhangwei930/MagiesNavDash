<template>
  <div ref="root" class="page account-page">
    <div class="container account-wrap">
      <PageHero
        :eyebrow="t('nav.account')"
        :title="t('account.title')"
        :desc="t('account.desc')"
        narrow
      />

      <div v-if="auth.isLoggedIn" class="account-card" data-reveal>
        <div class="user-row">
          <span class="user-av" aria-hidden="true">{{ avatarLetter }}</span>
          <div>
            <p class="user-email">{{ auth.user?.email }}</p>
            <p class="user-role">{{ t('account.role') }}：{{ auth.user?.role }}</p>
          </div>
        </div>
        <div class="account-actions">
          <NuxtLink v-if="auth.isAdmin" to="/admin" class="btn btn-primary">{{ t('account.admin') }}</NuxtLink>
          <button type="button" class="btn btn-secondary" @click="auth.logout()">{{ t('account.logout') }}</button>
        </div>
      </div>

      <div v-else class="account-card" data-reveal>
        <p class="why">{{ t('account.why') }}</p>
        <div class="form-row">
          <label class="label">{{ t('account.email') }}</label>
          <input v-model="auth.email" type="email" class="field" placeholder="you@example.com" />
        </div>
        <div class="form-row">
          <label class="label">{{ t('account.code') }}</label>
          <div class="code-row">
            <input
              v-model="auth.code"
              type="text"
              maxlength="6"
              class="field code-field"
              :placeholder="t('account.codePh')"
            />
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="auth.loading || !auth.email"
              @click="auth.sendVerificationCode()"
            >
              {{ t('account.send') }}
            </button>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-primary login-btn"
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
const root = ref<HTMLElement | null>(null)
useReveal(root)

const avatarLetter = computed(() => {
  const e = auth.user?.email || '?'
  return e.charAt(0).toUpperCase()
})
</script>

<style scoped>
.account-wrap {
  max-width: 460px;
}

.account-card {
  margin-top: 8px;
  padding: 24px;
  border-radius: 18px;
  background: rgba(12, 14, 24, 0.78);
  border: 1px solid rgba(167, 139, 250, 0.18);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.35),
    0 0 40px rgba(167, 139, 250, 0.08);
  backdrop-filter: blur(14px);
}

.user-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.user-av {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #0b0614;
  background: var(--ring-gradient);
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.35);
}

.user-email {
  margin: 0;
  font-weight: 700;
  color: var(--text-heading);
  word-break: break-all;
}

.user-role {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.account-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.why {
  margin: 0 0 18px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(167, 139, 250, 0.16);
  background: rgba(167, 139, 250, 0.06);
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.form-row {
  margin-bottom: 14px;
}

.code-row {
  display: flex;
  gap: 8px;
}

.code-field {
  font-family: ui-monospace, monospace;
  letter-spacing: 0.12em;
}

.login-btn {
  width: 100%;
  margin-top: 4px;
}

.ok {
  margin: 12px 0 0;
  font-size: 0.88rem;
  color: #6ee7b7;
}

.err {
  margin: 12px 0 0;
  font-size: 0.88rem;
  color: var(--danger);
}

:deep(.field:focus) {
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.18);
}
</style>
