<script setup lang="ts">
import { computed } from 'vue'
import { useGithubActivity } from '../composables/useGithubActivity'
import type { Locale } from '../composables/useLocale'

const props = withDefaults(defineProps<{ locale?: Locale }>(), {
  locale: 'zh'
})

const { weeks, loading, error, stats, hasRealData } = useGithubActivity()

const i18n = computed(() => {
  const real = hasRealData.value
  return {
    zh: {
      kicker: real ? 'CODE /' : 'EVENTS /',
      title: real ? 'GITHUB CONTRIBUTIONS' : 'RECENT PUBLIC EVENTS',
      total: real ? '贡献' : '事件',
      streak: '连续',
      active: '活跃日',
      empty: '暂无数据',
      error: '加载失败'
    },
    en: {
      kicker: real ? 'CODE /' : 'EVENTS /',
      title: real ? 'GITHUB CONTRIBUTIONS' : 'RECENT PUBLIC EVENTS',
      total: real ? 'Contributions' : 'Events',
      streak: 'Streak',
      active: 'Active Days',
      empty: 'No data',
      error: 'Failed to load'
    }
  }
})

const t = computed(() => i18n.value[props.locale] ?? i18n.value.en)

// Month labels aligned to week columns
const monthLabels = computed(() => {
  const seen = new Set()
  const labels: Array<{ week: number; text: string }> = []
  weeks.value.forEach((week, wi) => {
    const first = week[0]
    if (!first || first.isFuture) return
    const d = new Date(first.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!seen.has(key)) {
      seen.add(key)
      const short = d.toLocaleString(props.locale === 'zh' ? 'zh-CN' : 'en', { month: 'short' })
      const text = props.locale === 'zh' ? short : short.slice(0, 3).toUpperCase()
      labels.push({ week: wi, text })
    }
  })
  return labels
})

// Sparse weekday labels (Mon/Wed/Fri)
const weekdayLabels = computed(() => {
  // Monday = 0 in our grid layout
  const mondayBase = new Date(2024, 0, 1) // a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayBase)
    d.setDate(mondayBase.getDate() + i)
    return d.toLocaleString(props.locale === 'zh' ? 'zh-CN' : 'en', { weekday: 'narrow' })
  })
})
</script>

<template>
  <section class="github-section" aria-label="GitHub contribution activity">
    <div class="section-head">
      <span class="kicker">{{ t.kicker }}</span>
      <h2 class="display display-lg">{{ t.title }}</h2>
    </div>

    <div v-if="loading" class="placeholder">
      <span class="label-meta shimmer">LOADING...</span>
    </div>

    <div v-else-if="error" class="placeholder">
      <span class="label-meta">{{ t.error }}</span>
    </div>

    <template v-else>
      <!-- Stats row -->
      <div class="stats-bar">
        <div class="stat-pill">
          <span class="num">{{ stats.total }}</span>
          <span class="label-meta">{{ t.total }}</span>
        </div>
        <div class="stat-pill">
          <span class="num">{{ stats.streak }}</span>
          <span class="label-meta">{{ t.streak }}</span>
        </div>
        <div class="stat-pill">
          <span class="num">{{ stats.activeDays }}</span>
          <span class="label-meta">{{ t.active }}</span>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid-wrap">
        <div class="month-row" aria-hidden="true">
          <span
            v-for="m in monthLabels"
            :key="m.text + m.week"
            class="month-label label-meta"
            :style="{ left: `calc(${m.week} * (var(--cell) + var(--gap)))` }"
          >
            {{ m.text }}
          </span>
        </div>

        <div class="grid-body">
          <!-- Weekday labels (sparse: M/W/F) -->
          <div class="weekday-col" aria-hidden="true">
            <span
              v-for="(label, i) in weekdayLabels"
              :key="i"
              class="weekday-label label-meta"
              :class="{ 'is-visible': i % 2 === 1 }"
            >
              {{ label }}
            </span>
          </div>

          <!-- Weeks -->
          <div
            class="weeks"
            role="img"
            :aria-label="`${stats.total} ${t.total.toLowerCase()} in the last year`"
          >
            <div v-for="(week, wi) in weeks" :key="wi" class="week-col">
              <div
                v-for="(day, di) in week"
                :key="di"
                class="cell"
                :class="[`level-${day.level}`, { future: day.isFuture }]"
                :title="`${day.date}: ${day.count} ${t.total}`"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.github-section {
  margin-top: clamp(2rem, 3vw, 3.5rem);
}
.section-head {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}
.section-head h2 {
  margin: 0;
}

.placeholder {
  padding: 2rem;
  border: 1px dashed var(--hairline-dim);
  border-radius: 20px;
  text-align: center;
}
.shimmer {
  animation: shimmer 1.6s infinite ease-in-out;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--hairline);
  border-radius: 24px;
}
.stat-pill .num {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--mint);
  font-weight: 700;
}

.grid-wrap {
  --cell: 12px;
  --gap: 3px;
  padding: 1rem 1.1rem;
  border: 1px solid var(--hairline);
  border-radius: 20px;
  overflow-x: auto;
}
@media (max-width: 480px) {
  .grid-wrap {
    --cell: 10px;
    --gap: 2px;
  }
}

.month-row {
  position: relative;
  height: 14px;
  margin-bottom: 0.3rem;
  margin-left: 26px;
}
.month-label {
  position: absolute;
  top: 0;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.grid-body {
  display: flex;
  gap: var(--gap);
}

.weekday-col {
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  gap: var(--gap);
  margin-right: 0.25rem;
}
.weekday-label {
  font-size: 0.58rem;
  line-height: var(--cell);
  color: var(--text-meta);
  opacity: 0;
}
.weekday-label.is-visible {
  opacity: 1;
}

.weeks {
  display: flex;
  gap: var(--gap);
}
.week-col {
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  gap: var(--gap);
}

.cell {
  width: var(--cell);
  height: var(--cell);
  border-radius: 2px;
  background: var(--canvas);
  border: 1px solid var(--hairline-dim);
  transition: transform 0.15s var(--ease), background 0.2s var(--ease);
}
.cell:hover {
  transform: scale(1.35);
  z-index: 2;
  border-color: var(--mint);
}
.cell.level-1 {
  background: rgba(60, 255, 208, 0.22);
  border-color: rgba(60, 255, 208, 0.35);
}
.cell.level-2 {
  background: rgba(60, 255, 208, 0.45);
  border-color: rgba(60, 255, 208, 0.55);
}
.cell.level-3 {
  background: rgba(60, 255, 208, 0.7);
  border-color: rgba(60, 255, 208, 0.8);
}
.cell.level-4 {
  background: var(--mint);
  border-color: var(--mint);
}
.cell.future {
  background: transparent;
  border-color: transparent;
  pointer-events: none;
}
</style>
