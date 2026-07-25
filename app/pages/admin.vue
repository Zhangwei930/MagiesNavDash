<template>
  <div class="page">
    <div class="container">
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div>
        <h1 class="page-title" style="margin:0">后台管理</h1>
        <p class="page-desc" style="margin:6px 0 0">产品、用户与邮件日志</p>
      </div>
      <div v-if="auth.isAdmin" style="display:flex;gap:8px">
        <button class="btn btn-secondary" :disabled="loading" @click="load">刷新</button>
        <button class="btn btn-primary" @click="openCreate">添加产品</button>
      </div>
    </div>

    <div v-if="!auth.isLoggedIn" class="panel" style="padding:20px">
      请先 <NuxtLink to="/account" style="color:var(--accent)">登录</NuxtLink>
    </div>
    <div v-else-if="auth.user?.role !== 'ADMIN'" class="panel muted" style="padding:20px">
      需要管理员账号（admin@magies.top）
    </div>
    <div v-else-if="error" class="err">{{ error }}</div>
    <div v-else>
      <div class="stat-grid">
        <div v-for="c in cards" :key="c.label" class="stat">
          <div class="k">{{ c.label }}</div>
          <div class="v">{{ c.value }}</div>
        </div>
      </div>

      <div class="panel" style="overflow:hidden;margin-bottom:12px">
        <div class="panel-hd">产品管理</div>
        <table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>链接</th>
              <th>分类</th>
              <th>状态</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td style="font-weight:600">{{ p.name }}</td>
              <td class="muted" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                <a v-if="p.homepageUrl" :href="p.homepageUrl" target="_blank" rel="noopener" style="color:#2dd4bf">
                  {{ p.homepageUrl }}
                </a>
                <span v-else>—</span>
              </td>
              <td class="muted">{{ categoryLabel(p.categoryId) }}</td>
              <td class="muted">{{ p.status }}</td>
              <td style="text-align:right;white-space:nowrap">
                <button class="btn btn-secondary" @click="openEdit(p)">编辑</button>
                <button class="btn btn-danger" @click="remove(p)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel" style="overflow:hidden">
        <div class="panel-hd">邮件日志</div>
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>邮箱</th>
              <th>类型</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in data?.mailLogs || []" :key="m.id">
              <td class="muted" style="font-family:ui-monospace,monospace;font-size:12px">{{ formatTime(m.createdAt) }}</td>
              <td>{{ m.email }}</td>
              <td class="muted">{{ m.mailType }}</td>
              <td class="muted">{{ m.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="modal-mask" @click.self="showForm = false">
      <div class="modal">
        <h2>{{ form.id ? '编辑产品' : '添加产品' }}</h2>
        <div class="form-row">
          <label class="label">名称 *</label>
          <input v-model="form.name" class="field" placeholder="Magies Terminal" />
        </div>
        <div class="form-row">
          <label class="label">产品链接 *</label>
          <input v-model="form.homepageUrl" class="field" placeholder="https://shell.magies.top" />
        </div>
        <div class="form-row">
          <label class="label">一句话介绍</label>
          <input v-model="form.tagline" class="field" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-row">
            <label class="label">分类</label>
            <select v-model.number="form.categoryId" class="field">
              <option :value="1">工具站</option>
              <option :value="2">企业应用</option>
              <option :value="3">平台服务</option>
            </select>
          </div>
          <div class="form-row">
            <label class="label">图标</label>
            <select v-model="form.icon" class="field">
              <option v-for="opt in ICON_OPTIONS" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-row">
            <label class="label">slug</label>
            <input v-model="form.slug" class="field" placeholder="magies-terminal" />
          </div>
          <div class="form-row">
            <label class="label">状态</label>
            <select v-model="form.status" class="field">
              <option value="PUBLISHED">发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
        </div>
        <p v-if="formError" class="err">{{ formError }}</p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" @click="showForm = false">取消</button>
          <button class="btn btn-primary" type="button" :disabled="saving" @click="save">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICON_OPTIONS, categoryLabel } from '~/utils/toolMeta'

const auth = useAuthStore()
const data = ref<any>(null)
const products = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')

const emptyForm = () => ({
  id: null as number | null,
  name: '',
  slug: '',
  tagline: '',
  homepageUrl: '',
  categoryId: 1,
  icon: 'layout-grid',
  accentColor: '#2dd4bf',
  status: 'PUBLISHED'
})
const form = reactive(emptyForm())

const cards = computed(() => {
  const s = data.value?.stats || {}
  return [
    { label: '用户', value: s.users ?? '—' },
    { label: '产品', value: products.value.length },
    { label: '下载', value: s.downloadsTotal ?? '—' },
    { label: '邮件', value: s.mailSent ?? '—' }
  ]
})

function formatTime(v?: string) {
  if (!v) return '—'
  return new Date(v).toLocaleString('zh-CN')
}

function openCreate() {
  Object.assign(form, emptyForm())
  formError.value = ''
  showForm.value = true
}

function openEdit(p: any) {
  Object.assign(form, {
    id: p.id,
    name: p.name || '',
    slug: p.slug || '',
    tagline: p.tagline || '',
    homepageUrl: p.homepageUrl || '',
    categoryId: p.categoryId || 1,
    icon: p.icon || 'layout-grid',
    accentColor: p.accentColor || '#2dd4bf',
    status: p.status || 'PUBLISHED'
  })
  formError.value = ''
  showForm.value = true
}

async function save() {
  if (!form.name.trim() || !form.homepageUrl.trim()) {
    formError.value = '请填写名称和链接'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const { api } = useApi()
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      tagline: form.tagline.trim(),
      homepageUrl: form.homepageUrl.trim(),
      categoryId: form.categoryId,
      icon: form.icon,
      accentColor: form.accentColor,
      status: form.status
    }
    if (form.id) {
      await api(`/api/admin/products/${form.id}`, { method: 'PUT', body: JSON.stringify(body) })
    } else {
      await api('/api/admin/products', { method: 'POST', body: JSON.stringify(body) })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    formError.value = e.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function remove(p: any) {
  if (!confirm(`删除产品「${p.name}」？`)) return
  try {
    const { api } = useApi()
    await api(`/api/admin/products/${p.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

async function load() {
  if (!auth.isLoggedIn || auth.user?.role !== 'ADMIN') return
  loading.value = true
  error.value = ''
  try {
    const { api } = useApi()
    data.value = await api('/api/admin/dashboard')
    products.value = data.value?.products || []
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => auth.token, load)
</script>
