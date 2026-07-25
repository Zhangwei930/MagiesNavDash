<template>
  <div class="page">
    <div class="container">
    <h1 class="page-title">{{ t('download.title') }}</h1>
    <p class="page-desc">{{ t('download.desc') }}</p>

    <div v-if="loading" class="muted">{{ t('download.loading') }}</div>
    <div v-else-if="error" class="err">{{ error }}</div>
    <div v-else-if="!items.length" class="empty">{{ t('download.empty') }}</div>
    <div v-else class="panel" style="overflow:hidden">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t('download.product') }}</th>
            <th>{{ t('download.version') }}</th>
            <th>{{ t('download.notes') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.release.id">
            <td style="font-weight:600">{{ item.product?.name || '—' }}</td>
            <td style="font-family:ui-monospace,monospace;font-size:12px" class="muted">
              v{{ item.release.version }}
            </td>
            <td class="muted">{{ item.release.changelog }}</td>
            <td style="text-align:right">
              <button class="btn btn-secondary" @click="download(item)">{{ t('download.btn') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="toast" class="muted" style="margin-top:12px">{{ toast }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const loading = ref(true)
const error = ref('')
const toast = ref('')
const items = ref<any[]>([])

async function download(item: any) {
  toast.value = ''
  try {
    const { api } = useApi()
    const res = await api('/api/downloads', {
      method: 'POST',
      body: JSON.stringify({ productId: item.product.id, releaseId: item.release.id })
    })
    toast.value = res.message
  } catch (e: any) {
    toast.value = e.message || '失败'
  }
}

onMounted(async () => {
  try {
    const { api } = useApi()
    const [products, releases] = await Promise.all([
      api<any[]>('/api/products'),
      api<any[]>('/api/releases/latest')
    ])
    const map = Object.fromEntries(products.map((p) => [p.id, p]))
    items.value = releases.map((r) => ({ release: r, product: map[r.productId] }))
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
