<template>
  <div class="stats-root">
    <!-- Username / password login (not the email admin OTP) -->
    <div v-if="!signedIn" class="login-page">
      <form class="login-card" @submit.prevent="onLogin">
        <div class="login-brand">
          <img src="/brand/logo-mark-128.png" width="56" height="56" alt="" />
          <p class="login-series">MAGIES HUB · STATS</p>
        </div>
        <h1>数据大屏</h1>
        <p>输入用户名与密码进入分析看板</p>
        <label class="sr-only" for="stats-username">用户名</label>
        <input
          id="stats-username"
          v-model="username"
          type="text"
          autocomplete="username"
          placeholder="用户名"
          required
        />
        <div class="password-field">
          <label class="sr-only" for="stats-password">密码</label>
          <input
            id="stats-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="密码"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
        <button type="submit" :disabled="loginLoading">{{ loginLoading ? '登录中…' : '登录' }}</button>
        <p v-if="loginError" class="login-error" role="alert">{{ loginError }}</p>
      </form>
    </div>

    <div v-else class="dashboard" data-dashboard>
      <header class="dash-header">
        <div class="dash-title-row">
          <img src="/brand/logo-mark-128.png" width="40" height="40" alt="" />
          <div>
            <h1>Magies Hub 数据大屏</h1>
            <div class="meta">{{ metaLine }}</div>
          </div>
        </div>
        <div class="header-actions" role="toolbar" aria-label="大屏控制">
          <div class="seg" role="group" aria-label="时间范围">
            <button
              v-for="d in [7, 30, 90]"
              :key="d"
              type="button"
              class="seg-btn"
              :aria-pressed="rangeDays === d"
              @click="setRange(d)"
            >{{ d }} 日</button>
          </div>
          <span class="countdown" :class="{ paused }">{{ paused ? '已暂停' : `${countdown}s` }}</span>
          <button type="button" class="tool-btn" :aria-pressed="paused" @click="paused = !paused">
            {{ paused ? '继续' : '暂停' }}
          </button>
          <button type="button" class="tool-btn" :disabled="loading" @click="load">刷新</button>
          <button type="button" class="ghost-btn" @click="logout">退出</button>
        </div>
      </header>

      <div v-if="loading" class="loading-banner">同步中…</div>
      <div v-if="error" class="error-banner" role="alert">
        {{ error }}
        <button type="button" class="tool-btn" @click="load">重试</button>
      </div>

      <template v-if="payload">
        <section class="kpi-grid" aria-label="核心指标">
          <article class="kpi-card">
            <div class="kpi-label">今日访问</div>
            <div class="kpi-value">{{ n(payload.overview.visits.today) }}</div>
            <div class="kpi-delta" v-html="delta(payload.overview.visits.dod, '日环比')" />
          </article>
          <article class="kpi-card">
            <div class="kpi-label">今日下载</div>
            <div class="kpi-value">{{ n(payload.overview.downloads.today) }}</div>
            <div class="kpi-delta" v-html="delta(payload.overview.downloads.dod, '日环比')" />
          </article>
          <article class="kpi-card">
            <div class="kpi-label">本月访问</div>
            <div class="kpi-value">{{ n(payload.overview.visits.month) }}</div>
            <div class="kpi-delta" v-html="delta(payload.overview.visits.mom, '月环比')" />
          </article>
          <article class="kpi-card">
            <div class="kpi-label">本月下载</div>
            <div class="kpi-value">{{ n(payload.overview.downloads.month) }}</div>
            <div class="kpi-delta" v-html="delta(payload.overview.downloads.mom, '月环比')" />
          </article>
        </section>

        <section class="kpi-grid secondary" aria-label="转化与区间">
          <article class="kpi-card">
            <div class="kpi-label">区间访问</div>
            <div class="kpi-value">{{ n(payload.conversion.visits) }}</div>
            <div class="kpi-delta">近 {{ payload.rangeDays }} 日</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">区间下载</div>
            <div class="kpi-value">{{ n(payload.conversion.downloads) }}</div>
            <div class="kpi-delta">近 {{ payload.rangeDays }} 日</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">事件转化率</div>
            <div class="kpi-value">{{ rate(payload.conversion.eventRate) }}</div>
            <div class="kpi-delta">下载 / 访问</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">会话转化率</div>
            <div class="kpi-value">{{ rate(payload.conversion.sessionRate) }}</div>
            <div class="kpi-delta">有下载会话 / 有访问会话</div>
          </article>
        </section>

        <section class="kpi-grid secondary" aria-label="累计">
          <article class="kpi-card">
            <div class="kpi-label">总计访问</div>
            <div class="kpi-value">{{ n(payload.overview.visits.total) }}</div>
            <div class="kpi-delta">累计 page view</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">总计下载</div>
            <div class="kpi-value">{{ n(payload.overview.downloads.total) }}</div>
            <div class="kpi-delta">累计 download</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">访问会话</div>
            <div class="kpi-value">{{ n(payload.conversion.sessionsVisited) }}</div>
            <div class="kpi-delta">区间 unique session</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">下载会话</div>
            <div class="kpi-value">{{ n(payload.conversion.sessionsDownloaded) }}</div>
            <div class="kpi-delta">区间 unique session</div>
          </article>
        </section>

        <section class="chart-grid">
          <article class="panel wide">
            <h2>日趋势 · 访问 / 下载</h2>
            <div ref="dayChartEl" class="chart tall" />
            <div v-if="emptySeries(payload.timeseries.visitDay, payload.timeseries.downloadDay)" class="chart-empty visible">
              暂无趋势数据 — 站点访问后将自动汇入
            </div>
          </article>
          <article class="panel">
            <h2>月趋势</h2>
            <div ref="monthChartEl" class="chart" />
            <div v-if="emptySeries(payload.timeseries.visitMonth, payload.timeseries.downloadMonth)" class="chart-empty visible">
              暂无月度数据
            </div>
          </article>
        </section>

        <section class="chart-grid equal">
          <article class="panel">
            <h2>近 24 小时</h2>
            <div ref="hourlyChartEl" class="chart" />
          </article>
          <article class="panel">
            <h2>时段分布（0–23 时）</h2>
            <div ref="hodChartEl" class="chart" />
          </article>
        </section>

        <section class="chart-grid triple">
          <article class="panel">
            <h2>设备类型</h2>
            <div ref="deviceChartEl" class="chart" />
          </article>
          <article class="panel">
            <h2>操作系统</h2>
            <div ref="osChartEl" class="chart" />
          </article>
          <article class="panel">
            <h2>浏览器</h2>
            <div ref="browserChartEl" class="chart" />
          </article>
        </section>

        <section class="chart-grid equal">
          <article class="panel">
            <h2>热门路径</h2>
            <div ref="pathChartEl" class="chart" />
          </article>
          <article class="panel">
            <h2>下载产品</h2>
            <div ref="dlFileChartEl" class="chart" />
          </article>
        </section>

        <section class="chart-grid equal">
          <article class="panel">
            <h2>来源 Referrer</h2>
            <div ref="refChartEl" class="chart" />
          </article>
          <article class="panel">
            <h2>地域（访问）</h2>
            <div ref="geoChartEl" class="chart" />
            <p class="panel-hint">GeoIP 未接入时显示 Unknown；后续可挂 MaxMind。</p>
          </article>
        </section>

        <section class="panel recent-panel">
          <div class="recent-head">
            <h2>实时事件</h2>
            <div class="seg">
              <button
                v-for="f in recentFilters"
                :key="f.id"
                type="button"
                class="seg-btn"
                :aria-pressed="recentFilter === f.id"
                @click="recentFilter = f.id"
              >{{ f.label }}</button>
            </div>
          </div>
          <div class="table-wrap">
            <table class="recent-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>类型</th>
                  <th>路径 / 产品</th>
                  <th>设备</th>
                  <th>OS</th>
                  <th>浏览器</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in filteredRecent" :key="i">
                  <td class="mono">{{ formatTs(row.ts) }}</td>
                  <td>
                    <span class="tag" :data-type="row.eventType">
                      {{ row.eventType === 'download' ? '下载' : '访问' }}
                    </span>
                  </td>
                  <td>{{ row.eventType === 'download' ? (row.downloadFile || '—') : (row.path || '—') }}</td>
                  <td>{{ labelDevice(row.deviceType) }}</td>
                  <td>{{ row.osName || '—' }}</td>
                  <td>{{ row.browser || '—' }}</td>
                  <td class="mono muted">{{ row.ip || '—' }}</td>
                </tr>
                <tr v-if="!filteredRecent.length">
                  <td colspan="7" class="muted empty-row">暂无事件</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts, EChartsOption } from 'echarts'

definePageMeta({ layout: false })

echarts.use([BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

type SeriesPoint = { bucket: string; count: number }
type NamedCount = { name: string; count: number }
type MetricBlock = {
  today: number
  month: number
  total: number
  dod: number | null
  yoyDay: number | null
  mom: number | null
  yoyMonth: number | null
}
type DashboardPayload = {
  generatedAt: string
  rangeDays: number
  overview: { visits: MetricBlock; downloads: MetricBlock }
  conversion: {
    days: number
    visits: number
    downloads: number
    eventRate: number | null
    sessionsVisited: number
    sessionsDownloaded: number
    sessionRate: number | null
  }
  timeseries: {
    visitDay: SeriesPoint[]
    downloadDay: SeriesPoint[]
    visitMonth: SeriesPoint[]
    downloadMonth: SeriesPoint[]
  }
  hourly: { bucket: string; visits: number; downloads: number }[]
  hourOfDay: { hour: number; visits: number; downloads: number }[]
  geo: { visit: { country: string; region: string; city: string; count: number }[]; download: any[] }
  devices: { device: NamedCount[]; pcOs: NamedCount[]; browser: NamedCount[]; os: NamedCount[] }
  downloadFiles: NamedCount[]
  referrers: NamedCount[]
  paths: NamedCount[]
  recent: {
    ts: string
    eventType: string
    ip?: string
    deviceType?: string
    osName?: string
    browser?: string
    downloadFile?: string
    path?: string
  }[]
}

const TOKEN_KEY = 'magies_stats_token'

const token = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loginLoading = ref(false)
const loginError = ref('')
const signedIn = computed(() => !!token.value)

const payload = ref<DashboardPayload | null>(null)
const loading = ref(false)
const error = ref('')
const rangeDays = ref(30)
const paused = ref(false)
const countdown = ref(60)

if (import.meta.client) {
  token.value = sessionStorage.getItem(TOKEN_KEY) || ''
}

async function statsApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token.value) headers.set('Authorization', `Bearer ${token.value}`)
  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 || res.status === 403) {
    logout()
    throw new Error(data.message || '登录已过期，请重新登录')
  }
  if (!res.ok) throw new Error(data.message || `请求失败 (${res.status})`)
  return data as T
}
const recentFilter = ref<'all' | 'page_view' | 'download'>('all')
const recentFilters = [
  { id: 'all' as const, label: '全部' },
  { id: 'page_view' as const, label: '访问' },
  { id: 'download' as const, label: '下载' }
]

const dayChartEl = ref<HTMLElement | null>(null)
const monthChartEl = ref<HTMLElement | null>(null)
const hourlyChartEl = ref<HTMLElement | null>(null)
const hodChartEl = ref<HTMLElement | null>(null)
const deviceChartEl = ref<HTMLElement | null>(null)
const osChartEl = ref<HTMLElement | null>(null)
const browserChartEl = ref<HTMLElement | null>(null)
const pathChartEl = ref<HTMLElement | null>(null)
const dlFileChartEl = ref<HTMLElement | null>(null)
const refChartEl = ref<HTMLElement | null>(null)
const geoChartEl = ref<HTMLElement | null>(null)

const charts = new Map<string, ECharts>()
let timer: ReturnType<typeof setInterval> | null = null

const metaLine = computed(() => {
  if (!payload.value) return '加载中…'
  const t = new Date(payload.value.generatedAt)
  return `生成 ${t.toLocaleString('zh-CN')} · 范围 ${payload.value.rangeDays} 日 · 每 60s 自动刷新`
})

const filteredRecent = computed(() => {
  const rows = payload.value?.recent || []
  if (recentFilter.value === 'all') return rows
  return rows.filter((r) => r.eventType === recentFilter.value)
})

function n(v: number | null | undefined) {
  if (v == null) return '—'
  return Number(v).toLocaleString('zh-CN')
}

function rate(v: number | null | undefined) {
  if (v == null) return '—'
  return `${v}%`
}

function delta(value: number | null | undefined, label: string) {
  if (value == null) return `${label} —`
  const cls = value > 0 ? 'up' : value < 0 ? 'down' : ''
  const sign = value > 0 ? '+' : ''
  return `<span class="${cls}">${label} ${sign}${value}%</span>`
}

function labelDevice(name?: string) {
  if (!name) return '—'
  if (name === 'phone' || name === 'mobile') return '手机'
  if (name === 'tablet') return '平板'
  if (name === 'pc' || name === 'desktop' || name.startsWith('desktop/')) return 'PC'
  if (name === 'unknown') return '未知'
  return name
}

function formatTs(ts?: string) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('zh-CN', { hour12: false })
}

function emptySeries(a: SeriesPoint[], b: SeriesPoint[]) {
  return [...(a || []), ...(b || [])].every((p) => !p.count)
}

const CHART_AXIS = '#9aa0c4'
const CHART_SPLIT = 'rgba(140,150,220,0.12)'
const CHART_SERIES = ['#4f8cff', '#e879f9']
const CHART_BAR = ['#7b5cff']
const CHART_PIE = ['#4f8cff', '#a78bfa', '#e879f9', '#f472b6', '#38bdf8', '#c4b5fd', '#fb7185', '#818cf8']

function ensureChart(key: string, el: HTMLElement | null): ECharts | null {
  if (!el) return null
  let c = charts.get(key)
  if (!c || c.getDom() !== el) {
    c?.dispose()
    c = echarts.init(el)
    charts.set(key, c)
  }
  return c
}

function setChart(key: string, el: HTMLElement | null, option: EChartsOption, empty = false) {
  const c = ensureChart(key, el)
  if (!c) return
  if (empty) {
    c.clear()
    return
  }
  c.setOption(option, { notMerge: true })
}

function lineOption(visits: SeriesPoint[], downloads: SeriesPoint[]): EChartsOption {
  const buckets = Array.from(
    new Set([...(visits || []).map((i) => i.bucket), ...(downloads || []).map((i) => i.bucket)])
  ).sort()
  const vMap = new Map((visits || []).map((i) => [i.bucket, i.count]))
  const dMap = new Map((downloads || []).map((i) => [i.bucket, i.count]))
  return {
    color: CHART_SERIES,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(12,12,28,0.92)',
      borderColor: 'rgba(140,150,220,0.2)',
      textStyle: { color: '#f0eeff' }
    },
    legend: { data: ['访问', '下载'], bottom: 0, textStyle: { color: CHART_AXIS } },
    grid: { left: 40, right: 20, top: 24, bottom: 56 },
    xAxis: {
      type: 'category',
      data: buckets,
      axisLabel: {
        color: CHART_AXIS,
        hideOverlap: true,
        rotate: buckets.length > 14 ? 40 : 0,
        formatter: (v: string) => {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
          return m ? `${Number(m[2])}/${Number(m[3])}` : v
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } }
    },
    series: [
      { name: '访问', type: 'line', smooth: true, showSymbol: false, data: buckets.map((b) => vMap.get(b) || 0) },
      { name: '下载', type: 'line', smooth: true, showSymbol: false, data: buckets.map((b) => dMap.get(b) || 0) }
    ]
  }
}

function dualBarOption(labels: string[], visits: number[], downloads: number[]): EChartsOption {
  return {
    color: CHART_SERIES,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(12,12,28,0.92)',
      borderColor: 'rgba(140,150,220,0.2)',
      textStyle: { color: '#f0eeff' }
    },
    legend: { data: ['访问', '下载'], bottom: 0, textStyle: { color: CHART_AXIS } },
    grid: { left: 40, right: 16, top: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: CHART_AXIS, hideOverlap: true }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } }
    },
    series: [
      { name: '访问', type: 'bar', data: visits },
      { name: '下载', type: 'bar', data: downloads }
    ]
  }
}

function barOption(rows: NamedCount[]): EChartsOption {
  const list = (rows || []).slice(0, 12)
  return {
    color: CHART_BAR,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(12,12,28,0.92)',
      borderColor: 'rgba(140,150,220,0.2)',
      textStyle: { color: '#f0eeff' }
    },
    grid: { left: 100, right: 16, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: { color: CHART_AXIS },
      splitLine: { lineStyle: { color: CHART_SPLIT } }
    },
    yAxis: {
      type: 'category',
      data: list.map((r) => r.name).reverse(),
      axisLabel: { color: CHART_AXIS, width: 90, overflow: 'truncate' }
    },
    series: [
      {
        type: 'bar',
        data: list.map((r) => r.count).reverse(),
        barWidth: 12,
        itemStyle: { borderRadius: [0, 8, 8, 0] }
      }
    ]
  }
}

function pieOption(rows: NamedCount[], labelMap?: (n: string) => string): EChartsOption {
  const list = (rows || []).filter((r) => r.count > 0)
  return {
    color: CHART_PIE,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(12,12,28,0.92)',
      borderColor: 'rgba(140,150,220,0.2)',
      textStyle: { color: '#f0eeff' }
    },
    series: [
      {
        type: 'pie',
        radius: ['38%', '66%'],
        data: list.map((r) => ({ name: labelMap ? labelMap(r.name) : r.name, value: r.count })),
        label: { color: CHART_AXIS, fontSize: 11 }
      }
    ]
  }
}

function renderCharts() {
  const p = payload.value
  if (!p) return
  nextTick(() => {
    setChart(
      'day',
      dayChartEl.value,
      lineOption(p.timeseries.visitDay, p.timeseries.downloadDay),
      emptySeries(p.timeseries.visitDay, p.timeseries.downloadDay)
    )
    setChart(
      'month',
      monthChartEl.value,
      lineOption(p.timeseries.visitMonth, p.timeseries.downloadMonth),
      emptySeries(p.timeseries.visitMonth, p.timeseries.downloadMonth)
    )
    setChart(
      'hourly',
      hourlyChartEl.value,
      dualBarOption(
        p.hourly.map((h) => h.bucket.slice(-5)),
        p.hourly.map((h) => h.visits),
        p.hourly.map((h) => h.downloads)
      )
    )
    setChart(
      'hod',
      hodChartEl.value,
      dualBarOption(
        p.hourOfDay.map((h) => `${h.hour}`),
        p.hourOfDay.map((h) => h.visits),
        p.hourOfDay.map((h) => h.downloads)
      )
    )
    setChart('device', deviceChartEl.value, pieOption(p.devices.device, labelDevice))
    setChart('os', osChartEl.value, pieOption(p.devices.os || p.devices.pcOs))
    setChart('browser', browserChartEl.value, pieOption(p.devices.browser))
    setChart('paths', pathChartEl.value, barOption(p.paths || []))
    setChart('dl', dlFileChartEl.value, barOption(p.downloadFiles || []))
    setChart('ref', refChartEl.value, barOption(p.referrers || []))
    const geoRows = (p.geo?.visit || []).map((g) => ({
      name: [g.country, g.region, g.city].filter((x) => x && x !== '-').join(' · ') || 'Unknown',
      count: g.count
    }))
    setChart('geo', geoChartEl.value, barOption(geoRows))
  })
}

async function load() {
  if (!token.value) return
  loading.value = true
  error.value = ''
  try {
    payload.value = await statsApi<DashboardPayload>(`/api/stats/dashboard?days=${rangeDays.value}`)
    countdown.value = 60
    renderCharts()
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

function setRange(d: number) {
  rangeDays.value = d
  load()
}

async function onLogin() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const data = await fetch('/api/stats/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value.trim(), password: password.value })
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || '用户名或密码错误')
      return body as { token: string }
    })
    token.value = data.token
    sessionStorage.setItem(TOKEN_KEY, data.token)
    password.value = ''
    await load()
    startLoop()
  } catch (e: any) {
    loginError.value = e.message || '登录失败'
  } finally {
    loginLoading.value = false
  }
}

function logout() {
  token.value = ''
  payload.value = null
  sessionStorage.removeItem(TOKEN_KEY)
  stopLoop()
}

function onResize() {
  for (const c of charts.values()) c.resize()
}

function startLoop() {
  stopLoop()
  timer = setInterval(() => {
    if (paused.value) return
    countdown.value -= 1
    if (countdown.value <= 0) load()
  }, 1000)
}

function stopLoop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(async () => {
  window.addEventListener('resize', onResize)
  if (token.value) {
    await load()
    startLoop()
  }
})

onBeforeUnmount(() => {
  stopLoop()
  window.removeEventListener('resize', onResize)
  for (const c of charts.values()) c.dispose()
  charts.clear()
})
</script>

<style scoped>
.stats-root {
  --bg: #050510;
  --ink: #f0eeff;
  --muted: #9aa0c4;
  --danger: #ff6b8a;
  --title-gradient: linear-gradient(110deg, #7c9dff 0%, #a78bfa 40%, #f472b6 78%, #fb7185 100%);
  --btn-gradient: linear-gradient(105deg, #4f8cff 0%, #7c5cff 55%, #c084fc 100%);
  min-height: 100vh;
  color: var(--ink);
  background: var(--bg);
  font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
}

.stats-root::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 78% 12%, rgba(123, 92, 255, 0.26), transparent 55%),
    radial-gradient(ellipse 55% 40% at 14% 28%, rgba(79, 140, 255, 0.16), transparent 50%),
    linear-gradient(180deg, #04040d 0%, #070716 40%, #0a0618 100%);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.login-card {
  width: min(420px, 100%);
  padding: 2rem;
  border: 1px solid rgba(140, 150, 220, 0.18);
  border-radius: 22px;
  background: linear-gradient(165deg, rgba(30, 28, 60, 0.72), rgba(12, 12, 28, 0.92));
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.45);
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.login-brand img {
  border-radius: 50%;
  filter: drop-shadow(0 0 16px rgba(123, 92, 255, 0.5));
}

.login-series {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.28em;
  color: rgba(180, 185, 230, 0.42);
  text-transform: uppercase;
  font-family: ui-monospace, Menlo, monospace;
}

.login-card h1 {
  margin: 0;
  font-size: 1.55rem;
  text-align: center;
  background: var(--title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.login-card > p {
  margin: 0.65rem 0 1.2rem;
  color: var(--muted);
  text-align: center;
  font-size: 0.95rem;
}

.login-card input {
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(140, 150, 220, 0.16);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--ink);
}

.password-field {
  position: relative;
  margin-bottom: 0.75rem;
}

.password-field input {
  margin-bottom: 0;
  padding-right: 4.2rem;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.45rem;
  transform: translateY(-50%);
  min-width: 3.2rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid rgba(140, 150, 220, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
  font-size: 0.78rem;
  cursor: pointer;
}

.login-card button[type='submit'] {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.85rem;
  cursor: pointer;
  background: var(--btn-gradient);
  color: #fff;
  font-weight: 600;
}

.login-card button[type='submit']:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.login-error {
  color: var(--danger);
  text-align: center;
  font-size: 0.9rem;
  min-height: 1.2rem;
}

.login-ok {
  color: #7cf5ff;
  text-align: center;
  font-size: 0.9rem;
}

.dashboard {
  padding: 1.25rem 1.5rem 2.5rem;
  max-width: 1440px;
  margin: 0 auto;
}

.dash-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  padding: 1rem 1.15rem;
  border: 1px solid rgba(140, 150, 220, 0.14);
  border-radius: 18px;
  background: linear-gradient(165deg, rgba(30, 28, 60, 0.45), rgba(12, 12, 28, 0.55));
}

.dash-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.dash-title-row img {
  border-radius: 50%;
  filter: drop-shadow(0 0 12px rgba(123, 92, 255, 0.45));
}

.dash-header h1 {
  margin: 0;
  font-size: 1.35rem;
  background: var(--title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.meta {
  color: var(--muted);
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.78rem;
  margin-top: 0.3rem;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.ghost-btn,
.tool-btn {
  background: transparent;
  border: 1px solid rgba(140, 150, 220, 0.18);
  color: var(--ink);
  padding: 0.5rem 0.85rem;
  font-size: 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.ghost-btn:hover,
.tool-btn:hover {
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(123, 92, 255, 0.1);
}

.seg {
  display: inline-flex;
  border: 1px solid rgba(140, 150, 220, 0.18);
  border-radius: 999px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.seg-btn {
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  font-size: 0.82rem;
}

.seg-btn[aria-pressed='true'] {
  background: linear-gradient(105deg, rgba(79, 140, 255, 0.28), rgba(167, 139, 250, 0.22));
  color: var(--ink);
}

.countdown {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.78rem;
  color: var(--muted);
  min-width: 3.5rem;
  text-align: center;
}

.countdown.paused {
  color: #fbbf24;
}

.loading-banner,
.error-banner {
  margin-bottom: 0.85rem;
  padding: 0.65rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.loading-banner {
  background: rgba(79, 140, 255, 0.12);
  border: 1px solid rgba(79, 140, 255, 0.25);
  color: #c7d7ff;
}

.error-banner {
  background: rgba(255, 107, 138, 0.1);
  border: 1px solid rgba(255, 107, 138, 0.3);
  color: #ffb3c1;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 0.95rem;
}

.kpi-card {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(140, 150, 220, 0.14);
  background: linear-gradient(160deg, rgba(24, 22, 48, 0.75), rgba(10, 10, 22, 0.85));
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}

.kpi-label {
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.kpi-value {
  margin-top: 0.35rem;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.kpi-delta {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: var(--muted);
}

.kpi-delta :deep(.up) {
  color: #6ee7b7;
}

.kpi-delta :deep(.down) {
  color: #fb7185;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 0.85rem;
  margin-bottom: 0.95rem;
}

.chart-grid.equal {
  grid-template-columns: 1fr 1fr;
}

.chart-grid.triple {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.panel {
  position: relative;
  padding: 0.9rem 1rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(140, 150, 220, 0.14);
  background: linear-gradient(165deg, rgba(20, 18, 40, 0.72), rgba(10, 10, 22, 0.9));
  min-width: 0;
}

.panel.wide {
  min-height: 320px;
}

.panel h2 {
  margin: 0 0 0.5rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: #d8dcff;
}

.panel-hint {
  margin: 0.35rem 0 0;
  font-size: 0.72rem;
  color: var(--muted);
}

.chart {
  width: 100%;
  height: 240px;
}

.chart.tall {
  height: 300px;
}

.chart-empty {
  display: none;
  position: absolute;
  inset: 48px 16px 16px;
  place-items: center;
  color: var(--muted);
  font-size: 0.88rem;
  text-align: center;
  pointer-events: none;
}

.chart-empty.visible {
  display: grid;
}

.recent-panel {
  margin-top: 0.25rem;
}

.recent-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.table-wrap {
  overflow: auto;
  max-height: 420px;
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.recent-table th,
.recent-table td {
  padding: 0.55rem 0.6rem;
  border-bottom: 1px solid rgba(140, 150, 220, 0.1);
  text-align: left;
  white-space: nowrap;
}

.recent-table th {
  color: var(--muted);
  font-weight: 500;
  position: sticky;
  top: 0;
  background: rgba(10, 10, 22, 0.95);
  z-index: 1;
}

.mono {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.78rem;
}

.muted {
  color: var(--muted);
}

.empty-row {
  text-align: center !important;
  padding: 1.5rem !important;
}

.tag {
  display: inline-block;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  background: rgba(79, 140, 255, 0.18);
  color: #c7d7ff;
}

.tag[data-type='download'] {
  background: rgba(232, 121, 249, 0.18);
  color: #f5d0fe;
}

@media (max-width: 1100px) {
  .kpi-grid,
  .kpi-grid.secondary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chart-grid,
  .chart-grid.equal,
  .chart-grid.triple {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .kpi-grid,
  .kpi-grid.secondary {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 0.85rem;
  }
}
</style>
