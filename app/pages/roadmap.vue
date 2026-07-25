<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">{{ t('roadmap.title') }}</h1>
      <p class="page-desc">{{ t('roadmap.desc') }}</p>

      <div class="grid grid-4 road-grid">
        <div v-for="col in columns" :key="col.key" class="card road-col">
          <span class="section-label">{{ t(col.label) }}</span>
          <p class="road-desc">{{ t(col.desc) }}</p>
          <ul class="road-list">
            <li v-for="item in col.items" :key="item">{{ t(item) }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MsgKey } from '~/composables/useI18n'

const { t } = useI18n()

const columns: { key: string; label: MsgKey; desc: MsgKey; items: MsgKey[] }[] = [
  {
    key: 'now',
    label: 'roadmap.now',
    desc: 'roadmap.nowDesc',
    items: ['roadmap.item.terminal', 'roadmap.item.hub', 'roadmap.item.studio']
  },
  {
    key: 'next',
    label: 'roadmap.next',
    desc: 'roadmap.nextDesc',
    items: ['roadmap.item.feedback', 'roadmap.item.docs']
  },
  {
    key: 'later',
    label: 'roadmap.later',
    desc: 'roadmap.laterDesc',
    items: ['roadmap.item.license', 'roadmap.item.team']
  },
  {
    key: 'released',
    label: 'roadmap.released',
    desc: 'roadmap.releasedDesc',
    items: ['roadmap.item.nav', 'roadmap.item.account']
  }
]
</script>

<style scoped>
.road-grid {
  margin-top: 28px;
}

@media (max-width: 960px) {
  .road-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .road-grid {
    grid-template-columns: 1fr;
  }
}

.road-col {
  min-height: 100%;
}

.road-desc {
  margin: 10px 0 14px;
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.road-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.road-list li {
  position: relative;
  padding: 10px 12px 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text);
}
</style>
