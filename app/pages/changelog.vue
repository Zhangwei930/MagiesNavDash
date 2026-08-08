<template>
  <div ref="root" class="page changelog-page">
    <div class="container">
      <PageHero
        :eyebrow="t('nav.blog')"
        :title="t('changelog.title')"
        :desc="t('changelog.desc')"
      />

      <div v-if="loading" class="muted text-center">{{ t('changelog.loading') }}</div>
      <div v-else-if="error" class="err text-center">{{ error }}</div>

      <div v-else class="product-columns">
        <section
          v-for="product in products"
          :key="product.key"
          class="product-col"
          data-reveal
        >
          <header class="product-head">
            <div
              class="product-mark"
              :data-logo="toolLogo(product.slug) ? '' : null"
            >
              <ProductIcon
                :slug="product.slug"
                :size="toolLogo(product.slug) ? 48 : 22"
                :fill="!!toolLogo(product.slug)"
              />
            </div>
            <div class="product-id">
              <h2>{{ product.label }}</h2>
              <a
                class="product-link"
                :href="product.homepage"
                target="_blank"
                rel="noopener"
              >{{ t('changelog.viewSite') }} →</a>
            </div>
          </header>

          <p v-if="product.error" class="col-err">{{ t('changelog.feedError') }}</p>
          <p v-else-if="!product.releases.length" class="col-empty">{{ t('changelog.emptyProduct') }}</p>

          <ol v-else class="release-list">
            <li v-for="rel in product.releases" :key="rel.version" class="release-card">
              <div class="release-meta">
                <code class="release-ver">v{{ rel.version }}</code>
                <time v-if="rel.date" class="release-date">{{ rel.date }}</time>
              </div>

              <template v-if="rel.sections.length">
                <div v-for="(sec, si) in rel.sections" :key="si" class="release-section">
                  <h3 v-if="sec.title" class="section-title">{{ sec.title }}</h3>
                  <ul class="section-items">
                    <li v-for="(item, ii) in sec.items" :key="ii">{{ item }}</li>
                  </ul>
                </div>
              </template>
              <p v-else-if="rel.notes" class="release-notes">{{ rel.notes }}</p>
              <p v-else class="release-notes muted">{{ t('changelog.noNotes') }}</p>
            </li>
          </ol>
        </section>
      </div>

      <div class="page-cta" data-reveal>
        <NuxtLink class="btn btn-primary" to="/download">{{ t('changelog.gotoDownload') }}</NuxtLink>
        <NuxtLink class="btn btn-outline" to="/products">{{ t('footer.allProducts') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolLogo } from '~/utils/toolMeta'
import type { ProductChangelog } from '~/utils/changelogFeed'

const { t, locale } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const loading = ref(true)
const error = ref('')
const products = ref<ProductChangelog[]>([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    // Same-origin Nitro feed — Terminal markdown has no CORS, so the browser
    // cannot pull shell.magies.top/changelog*.md directly.
    const loc = locale.value === 'en' ? 'en' : 'zh'
    products.value = await $fetch<ProductChangelog[]>('/feeds/changelogs', {
      query: { locale: loc }
    })
  } catch (e: any) {
    error.value = e?.data?.message || e.message || t('common.loadFailed')
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(locale, load)
</script>

<style scoped>
.text-center {
  text-align: center;
}

.err {
  color: var(--danger);
}

.product-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 12px;
  align-items: start;
}

.product-col {
  padding: 20px 18px 22px;
  border-radius: 18px;
  border: 1px solid rgba(167, 139, 250, 0.16);
  background: rgba(12, 14, 24, 0.72);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
  min-width: 0;
}

.product-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(167, 139, 250, 0.12);
}

.product-mark {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(167, 139, 250, 0.22);
  background: rgba(8, 10, 18, 0.5);
}

.product-mark[data-logo] {
  background: transparent;
  border-color: rgba(167, 139, 250, 0.18);
}

.product-mark[data-logo] :deep(.product-logo) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.product-id h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-heading);
}

.product-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--accent);
  text-decoration: none;
}

.product-link:hover {
  color: var(--accent-hover);
}

.col-err,
.col-empty {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.col-err {
  color: var(--danger);
}

.release-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: min(72vh, 900px);
  overflow: auto;
  padding-right: 4px;
}

.release-card {
  padding: 14px 14px 12px;
  border-radius: 12px;
  border: 1px solid rgba(167, 139, 250, 0.12);
  background: rgba(8, 10, 18, 0.45);
}

.release-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.release-ver {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.92rem;
  font-weight: 650;
  color: var(--accent);
}

.release-date {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.section-title {
  margin: 10px 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-heading);
}

.section-items {
  margin: 0;
  padding-left: 1.1em;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-items li {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--text);
}

.release-notes {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
}

.release-notes.muted {
  color: var(--text-muted);
}

.page-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 28px 0 8px;
}

@media (max-width: 900px) {
  .product-columns {
    grid-template-columns: 1fr;
  }

  .release-list {
    max-height: none;
  }
}
</style>
