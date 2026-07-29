<template>
  <div class="showcase" data-reveal>
    <div class="showcase-chrome">
      <div class="showcase-sidebar">
        <div class="sb-brand">
          <span class="sb-dot" />
          <span>Magies Data Studio</span>
        </div>
        <nav class="sb-nav">
          <span class="sb-item active">Dashboard</span>
          <span class="sb-item">Projects</span>
          <span class="sb-item">Sources</span>
          <span class="sb-item">Tasks</span>
          <span class="sb-item">Schedules</span>
          <span class="sb-item">Data</span>
          <span class="sb-item">Reports</span>
          <span class="sb-item">Settings</span>
        </nav>
      </div>

      <div class="showcase-main">
        <header class="showcase-top">
          <h3>Dashboard</h3>
          <div class="top-right">
            <span class="pill">All Projects</span>
            <span class="avatar" />
          </div>
        </header>

        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-label">Total Records</span>
            <strong class="kpi-value">1,326,768</strong>
            <span class="kpi-delta up">+12.3% from yesterday</span>
          </div>
          <div class="kpi">
            <span class="kpi-label">Success Rate</span>
            <strong class="kpi-value">99.66%</strong>
            <span class="kpi-delta up">+0.1% from yesterday</span>
          </div>
          <div class="kpi">
            <span class="kpi-label">Running Tasks</span>
            <strong class="kpi-value">12</strong>
            <span class="kpi-delta muted">3 queued</span>
          </div>
          <div class="kpi">
            <span class="kpi-label">Data Sources</span>
            <strong class="kpi-value">68</strong>
            <span class="kpi-delta up">+4 this week</span>
          </div>
        </div>

        <div class="panel-row">
          <div class="panel chart-panel">
            <div class="panel-head">
              <span>Collection Trend</span>
              <span class="chip">7 Days</span>
            </div>
            <svg class="chart" viewBox="0 0 360 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(96,165,250,0.45)" />
                  <stop offset="100%" stop-color="rgba(96,165,250,0)" />
                </linearGradient>
                <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#60a5fa" />
                  <stop offset="55%" stop-color="#a78bfa" />
                  <stop offset="100%" stop-color="#f472b6" />
                </linearGradient>
              </defs>
              <path
                class="chart-area"
                d="M0,88 C30,82 50,90 72,70 C95,48 110,55 140,42 C170,28 190,50 220,38 C250,26 280,20 310,28 C330,34 345,22 360,18 L360,120 L0,120 Z"
                fill="url(#areaFill)"
              />
              <path
                class="chart-line"
                d="M0,88 C30,82 50,90 72,70 C95,48 110,55 140,42 C170,28 190,50 220,38 C250,26 280,20 310,28 C330,34 345,22 360,18"
                fill="none"
                stroke="url(#lineStroke)"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
            <div class="chart-axis">
              <span>May 12</span><span>May 14</span><span>May 16</span><span>May 18</span>
            </div>
          </div>

          <div class="panel tasks-panel">
            <div class="panel-head">
              <span>Running Tasks</span>
            </div>
            <ul class="task-list">
              <li v-for="task in tasks" :key="task.name">
                <span class="task-dot" :style="{ background: task.color }" />
                <div class="task-meta">
                  <strong>{{ task.name }}</strong>
                  <span>{{ task.desc }}</span>
                </div>
                <div class="task-bar">
                  <i :style="{ width: task.pct + '%', background: task.color }" />
                </div>
                <em>{{ task.pct }}%</em>
              </li>
            </ul>
          </div>

          <div class="panel workflow-panel">
            <div class="panel-head">
              <span>Visual Workflow</span>
            </div>
            <div class="workflow">
              <span v-for="n in 7" :key="n" class="node" :class="'n' + n" />
              <svg class="wires" viewBox="0 0 160 140">
                <path d="M30,30 C55,30 55,70 80,70" />
                <path d="M30,70 C50,70 55,70 80,70" />
                <path d="M30,110 C55,110 55,70 80,70" />
                <path d="M80,70 C105,70 110,40 130,40" />
                <path d="M80,70 C105,70 110,100 130,100" />
              </svg>
            </div>
            <p class="workflow-cap">Build your data pipeline with drag &amp; drop.</p>
          </div>
        </div>

        <div class="feature-strip">
          <div v-for="f in features" :key="f.title" class="feat">
            <span class="feat-icon" :style="{ color: f.color }">{{ f.icon }}</span>
            <div>
              <strong>{{ f.title }}</strong>
              <span>{{ f.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tasks = [
  { name: 'E-commerce Products', desc: 'Collecting data…', pct: 75, color: '#60a5fa' },
  { name: 'Social Media Posts', desc: 'Processing…', pct: 45, color: '#a78bfa' },
  { name: 'News Articles', desc: 'Collecting data…', pct: 92, color: '#34d399' },
  { name: 'Job Listings', desc: 'Completed', pct: 100, color: '#fbbf24' }
]

const features = [
  { icon: '↻', title: 'Real-time Sync', desc: 'Data updates in real time', color: '#34d399' },
  { icon: '✦', title: 'Smart Extraction', desc: 'AI-powered data extraction', color: '#60a5fa' },
  { icon: '◷', title: 'Auto Scheduling', desc: 'Run tasks automatically', color: '#a78bfa' },
  { icon: '▣', title: 'Data Security', desc: 'Enterprise-grade security', color: '#f472b6' }
]
</script>

<style scoped>
.showcase {
  position: relative;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.45),
    rgba(167, 139, 250, 0.35),
    rgba(251, 146, 60, 0.25)
  );
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 60px rgba(167, 139, 250, 0.12);
}

.showcase-chrome {
  display: grid;
  grid-template-columns: 168px 1fr;
  border-radius: 19px;
  overflow: hidden;
  background: rgba(8, 10, 18, 0.96);
  min-height: 420px;
}

.showcase-sidebar {
  padding: 18px 14px;
  border-right: 1px solid rgba(167, 139, 250, 0.12);
  background: rgba(0, 0, 0, 0.28);
}

.sb-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 650;
  color: #e2e8f0;
  margin-bottom: 18px;
  letter-spacing: 0.01em;
}

.sb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.7);
}

.sb-nav {
  display: grid;
  gap: 4px;
}

.sb-item {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.sb-item.active {
  color: #e9d5ff;
  background: rgba(167, 139, 250, 0.14);
  box-shadow: inset 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.showcase-main {
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.showcase-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.showcase-top h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #f8fafc;
  font-weight: 700;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill {
  font-size: 0.7rem;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  padding: 4px 10px;
}

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #a78bfa 50%, #fb923c);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.kpi {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(167, 139, 250, 0.12);
  display: grid;
  gap: 4px;
}

.kpi-label {
  font-size: 0.68rem;
  color: #94a3b8;
}

.kpi-value {
  font-size: 1.15rem;
  color: #f8fafc;
  font-weight: 750;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.kpi-delta {
  font-size: 0.65rem;
}

.kpi-delta.up {
  color: #6ee7b7;
}

.kpi-delta.muted {
  color: #94a3b8;
}

.panel-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr 0.85fr;
  gap: 10px;
  min-height: 180px;
}

.panel {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(167, 139, 250, 0.12);
  padding: 12px;
  min-width: 0;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #cbd5e1;
  margin-bottom: 10px;
  font-weight: 600;
}

.chip {
  font-size: 0.62rem;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 6px;
  padding: 2px 6px;
}

.chart {
  width: 100%;
  height: 100px;
  display: block;
}

.chart-line {
  stroke-dasharray: 480;
  stroke-dashoffset: 480;
  animation: drawLine 2.4s ease forwards 0.3s;
}

.chart-area {
  opacity: 0;
  animation: fadeIn 1s ease forwards 0.8s;
}

.chart-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.6rem;
  color: #64748b;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.task-list li {
  display: grid;
  grid-template-columns: 8px 1fr 48px 28px;
  gap: 8px;
  align-items: center;
}

.task-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.task-meta {
  display: grid;
  min-width: 0;
}

.task-meta strong {
  font-size: 0.68rem;
  color: #e2e8f0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta span {
  font-size: 0.58rem;
  color: #64748b;
}

.task-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.task-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  animation: barGrow 1.4s ease forwards;
}

.task-list em {
  font-style: normal;
  font-size: 0.62rem;
  color: #94a3b8;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.workflow {
  position: relative;
  height: 120px;
  margin: 4px 0;
}

.wires {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.wires path {
  fill: none;
  stroke: rgba(167, 139, 250, 0.35);
  stroke-width: 1.2;
}

.node {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.5), rgba(167, 139, 250, 0.45));
  border: 1px solid rgba(196, 181, 253, 0.45);
  box-shadow: 0 0 12px rgba(167, 139, 250, 0.35);
  animation: nodePulse 2.8s ease-in-out infinite;
}

.n1 { left: 12%; top: 14%; }
.n2 { left: 12%; top: 42%; animation-delay: 0.2s; background: linear-gradient(135deg, #34d39988, #60a5fa88); }
.n3 { left: 12%; top: 70%; animation-delay: 0.4s; }
.n4 { left: 44%; top: 42%; animation-delay: 0.1s; width: 22px; height: 22px; }
.n5 { left: 72%; top: 18%; animation-delay: 0.3s; background: linear-gradient(135deg, #fb923c88, #f472b688); }
.n6 { left: 72%; top: 42%; animation-delay: 0.5s; }
.n7 { left: 72%; top: 66%; animation-delay: 0.6s; }

.workflow-cap {
  margin: 0;
  font-size: 0.65rem;
  color: #94a3b8;
  line-height: 1.4;
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.feat {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(167, 139, 250, 0.1);
}

.feat-icon {
  font-size: 0.85rem;
  line-height: 1;
  margin-top: 1px;
}

.feat strong {
  display: block;
  font-size: 0.68rem;
  color: #e2e8f0;
  font-weight: 650;
}

.feat span {
  font-size: 0.6rem;
  color: #64748b;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes barGrow {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}

@keyframes nodePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

@media (max-width: 960px) {
  .showcase-chrome {
    grid-template-columns: 1fr;
  }

  .showcase-sidebar {
    display: none;
  }

  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panel-row {
    grid-template-columns: 1fr;
  }

  .feature-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .feature-strip {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chart-line,
  .chart-area,
  .task-bar i,
  .node {
    animation: none !important;
  }

  .chart-line {
    stroke-dashoffset: 0;
  }

  .chart-area {
    opacity: 1;
  }
}
</style>
