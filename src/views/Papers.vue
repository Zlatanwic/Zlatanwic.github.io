<script setup lang="ts">
import { ref, computed } from 'vue'
import { categoryOrder, papers, statusLabel, statusOrder } from '../data/papers'
import type { Paper, PaperCategory, PaperStatus } from '../data/papers'

type FilterStatus = 'ALL' | PaperStatus
type FilterCategory = 'ALL' | PaperCategory

const counts = {
  read: papers.filter(p => p.status === 'read').length,
  reading: papers.filter(p => p.status === 'reading').length,
  queued: papers.filter(p => p.status === 'queued').length
}

const categories: FilterCategory[] = ['ALL', ...categoryOrder]

const activeCategory = ref<FilterCategory>('ALL')
const activeStatus = ref<FilterStatus>('ALL')
const searchQuery = ref('')

// Two-stage filter: category narrows, then status narrows further.
const filtered = computed(() => {
  let list: Paper[] = papers
  if (activeCategory.value !== 'ALL') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (activeStatus.value !== 'ALL') {
    list = list.filter(p => p.status === activeStatus.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(p =>
      [
        p.title,
        p.venue,
        p.category,
        p.area,
        p.takeaway,
        statusLabel[p.status]
      ]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(q))
    )
  }
  return list
})

// Counts aware of the OTHER filter, so chips reflect what clicking will yield.
const categoryCount = (cat: FilterCategory) => {
  const base =
    activeStatus.value === 'ALL'
      ? papers
      : papers.filter(p => p.status === activeStatus.value)
  return cat === 'ALL' ? base.length : base.filter(p => p.category === cat).length
}

const statusCount = (s: FilterStatus) => {
  const base =
    activeCategory.value === 'ALL'
      ? papers
      : papers.filter(p => p.category === activeCategory.value)
  return s === 'ALL' ? base.length : base.filter(p => p.status === s).length
}
</script>

<template>
  <article>
    <header class="head">
      <span class="kicker kicker-uv">READING&nbsp;PAPERS / 论文阅读</span>
      <h1 class="display display-xl">PAPERS.LOG</h1>
      <p class="lede">
        围绕 LLM 推理、KV cache、kernel 与系统优化整理的阅读清单，持续更新中。
      </p>

      <div class="stats">
        <div class="stat">
          <span class="dot read"></span>
          <span class="label-meta">已读</span>
          <span class="num">{{ counts.read }}</span>
        </div>
        <div class="stat">
          <span class="dot reading"></span>
          <span class="label-meta">在读</span>
          <span class="num">{{ counts.reading }}</span>
        </div>
        <div class="stat">
          <span class="dot queued"></span>
          <span class="label-meta">待读</span>
          <span class="num">{{ counts.queued }}</span>
        </div>
      </div>
    </header>

    <div class="search-row">
      <label class="kicker search-label" for="paper-search">SEARCH /</label>
      <input
        id="paper-search"
        v-model="searchQuery"
        class="search-input"
        type="search"
        placeholder="TITLE / VENUE / CATEGORY / AREA"
        autocomplete="off"
      >
      <button
        v-if="searchQuery"
        class="search-clear"
        type="button"
        aria-label="Clear search"
        @click="searchQuery = ''"
      >
        CLEAR
      </button>
    </div>

    <!-- Category filter -->
    <nav class="filter" aria-label="Filter by category">
      <span class="kicker filter-label">CATEGORY /</span>
      <div class="chips" role="tablist">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="chip"
          role="tab"
          :aria-selected="activeCategory === cat"
          :class="{ 'is-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          <span>{{ cat }}</span>
          <span class="chip-count">{{ categoryCount(cat) }}</span>
        </button>
      </div>
    </nav>

    <!-- Status filter -->
    <nav class="filter filter-status" aria-label="Filter by status">
      <span class="kicker filter-label">STATUS /</span>
      <div class="chips" role="tablist">
        <button
          type="button"
          class="chip"
          role="tab"
          :aria-selected="activeStatus === 'ALL'"
          :class="{ 'is-active': activeStatus === 'ALL' }"
          @click="activeStatus = 'ALL'"
        >
          <span>ALL</span>
          <span class="chip-count">{{ statusCount('ALL') }}</span>
        </button>
        <button
          v-for="s in statusOrder"
          :key="s"
          type="button"
          class="chip"
          :data-status="s"
          role="tab"
          :aria-selected="activeStatus === s"
          :class="{ 'is-active': activeStatus === s }"
          @click="activeStatus = s"
        >
          <span class="chip-dot" :class="s"></span>
          <span>{{ statusLabel[s] }}</span>
          <span class="chip-count">{{ statusCount(s) }}</span>
        </button>
      </div>
    </nav>

    <ul v-if="filtered.length" class="papers" role="list">
      <li
        v-for="p in filtered"
        :key="p.title"
        class="paper"
        :data-status="p.status"
      >
        <div class="paper-meta">
          <span class="dot" :class="p.status"></span>
          <span class="tag tag--ghost cat-tag">{{ p.category }}</span>
          <span class="label-meta">{{ p.venue }}</span>
          <template v-if="p.area">
            <span class="sep">·</span>
            <span class="label-meta">{{ p.area }}</span>
          </template>
          <span class="sep">·</span>
          <span class="label-meta status-tag">{{ statusLabel[p.status] }}</span>
        </div>
        <h2 class="paper-title">
          <a
            v-if="p.url"
            class="paper-link"
            :href="p.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ p.title }}<span class="link-arrow" aria-hidden="true">↗</span>
          </a>
          <template v-else>{{ p.title }}</template>
        </h2>
        <p v-if="p.takeaway" class="paper-take">{{ p.takeaway }}</p>
      </li>
    </ul>

    <p v-else class="empty">
      <span class="label-meta">
        NO PAPERS UNDER “{{ activeCategory }}” /
        “{{ activeStatus === 'ALL' ? 'ALL' : statusLabel[activeStatus] }}”
        <template v-if="searchQuery"> / “{{ searchQuery }}”</template>
        YET — 这个组合还没有论文。
      </span>
    </p>
  </article>
</template>

<style scoped>
.head {
  padding: clamp(1rem, 2vw, 2rem) 0 clamp(1.5rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--hairline-dim);
  display: grid;
  gap: 1rem;
}
.head h1 {
  margin: 0;
}

.stats {
  display: flex;
  gap: 1.6rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}
.stat .num {
  font-family: var(--font-display);
  color: var(--text);
  font-size: 1.4rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot.read { background: var(--mint); }
.dot.reading { background: var(--tile-yellow); }
.dot.queued {
  background: var(--canvas);
  border: 1px solid var(--text-meta);
}

/* ---- Filter rows ---- */
.search-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: clamp(1.4rem, 2vw, 2rem);
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--hairline-dim);
}
.search-label {
  color: var(--mint);
  flex-shrink: 0;
}
.search-input {
  width: min(620px, 100%);
  min-width: 0;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 0.65rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  outline: none;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.search-input::placeholder {
  color: var(--text-meta);
  opacity: 0.85;
}
.search-input:focus {
  border-color: var(--mint);
  box-shadow: 0 0 0 1px var(--mint) inset;
}
.search-clear {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--uv);
  background: transparent;
  border: 1px solid var(--uv);
  border-radius: 24px;
  padding: 0.55rem 0.85rem;
  cursor: pointer;
  transition: background var(--dur) var(--ease),
    color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.search-clear:hover {
  background: var(--uv);
  color: var(--white);
}
.filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--hairline-dim);
}
.filter:first-of-type {
  margin-top: 0.7rem;
}
.filter-status {
  margin-top: 0.7rem;
}
.filter-label {
  color: var(--uv);
}
.filter-status .filter-label {
  color: var(--mint);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 0.45rem 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease),
    background var(--dur) var(--ease);
}
.chip:hover {
  color: var(--mint);
  border-color: var(--mint);
}
.chip:focus-visible {
  outline: 2px solid var(--focus-cyan);
  outline-offset: 2px;
}
.chip.is-active {
  background: var(--mint);
  border-color: var(--mint);
  color: var(--black);
}
.chip[data-status='reading'].is-active {
  background: var(--tile-yellow);
  border-color: var(--tile-yellow);
  color: var(--black);
}
.chip[data-status='queued'].is-active {
  background: transparent;
  border-color: var(--text);
  color: var(--text);
}
.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.chip-dot.read { background: var(--mint); }
.chip-dot.reading { background: var(--tile-yellow); }
.chip-dot.queued {
  background: var(--canvas);
  border: 1px solid var(--text-meta);
}
.chip.is-active .chip-dot.queued { border-color: var(--black); }
.chip-count {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 0.05rem 0.4rem;
  border-radius: 12px;
  background: var(--canvas);
  color: var(--text-meta);
  border: 1px solid var(--hairline-dim);
  min-width: 1.4rem;
  text-align: center;
}
.chip.is-active .chip-count {
  background: var(--black);
  color: var(--mint);
  border-color: var(--black);
}
.chip[data-status='reading'].is-active .chip-count {
  color: var(--tile-yellow);
}

/* ---- Papers list ---- */
.papers {
  list-style: none;
  padding: 0;
  margin: clamp(1.5rem, 2vw, 2.5rem) 0 0;
  display: grid;
  gap: 0.7rem;
}
.paper {
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--hairline);
  border-left: 3px solid var(--text-meta);
  border-radius: 20px;
  transition: border-left-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.paper:hover {
  transform: translateX(4px);
  border-left-color: var(--mint);
}
.paper[data-status='read']    { border-left-color: var(--mint); }
.paper[data-status='reading'] { border-left-color: var(--tile-yellow); }
.paper[data-status='queued']  { border-left-color: var(--text-meta); }

.paper-meta {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.55rem;
}
.cat-tag {
  border-color: var(--mint);
  color: var(--mint);
}
.sep {
  color: var(--text-meta);
  opacity: 0.5;
}
.status-tag {
  color: var(--mint);
}
.paper[data-status='reading'] .status-tag { color: var(--tile-yellow); }
.paper[data-status='queued'] .status-tag { color: var(--text-meta); }

.paper-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-sans);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.005em;
  color: var(--text);
}
.paper-link {
  color: inherit;
  text-decoration: none;
  display: inline;
  transition: color var(--dur) var(--ease);
  border-bottom: 1px solid transparent;
}
.paper-link:hover {
  color: var(--hover-blue);
  border-bottom-color: var(--hover-blue);
}
.paper-link:focus-visible {
  outline: 2px solid var(--focus-cyan);
  outline-offset: 3px;
  border-radius: 2px;
}
.link-arrow {
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 0.85em;
  color: var(--mint);
  transition: transform var(--dur) var(--ease), color var(--dur) var(--ease);
}
.paper-link:hover .link-arrow {
  transform: translate(2px, -2px);
  color: var(--hover-blue);
}
.paper-take {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 70ch;
}

.empty {
  margin: 3rem 0;
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--hairline-dim);
  border-radius: 20px;
}

@media (max-width: 640px) {
  .search-row {
    align-items: stretch;
    flex-direction: column;
  }
  .search-clear {
    align-self: flex-start;
  }
}
</style>
