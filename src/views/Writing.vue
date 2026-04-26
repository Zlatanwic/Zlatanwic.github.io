<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { labelPostCollection, posts } from '../data/posts'

type WritingTab = 'paper-notes' | 'tech' | 'misc'

const searchQuery = ref('')
const activeTab = ref<WritingTab>('paper-notes')
const activeCategory = ref('ALL')

const tabs: { id: WritingTab; label: string; deck: string }[] = [
  { id: 'paper-notes', label: 'PAPER NOTES', deck: 'reading notes' },
  { id: 'tech', label: 'TECH', deck: 'technical blogs' },
  { id: 'misc', label: 'MISC', deck: 'logs & essays' }
]

const postsInTab = (tab: WritingTab) =>
  posts.filter(post => post.collection === tab)

const categories = computed(() => [
  'ALL',
  ...Array.from(new Set(postsInTab(activeTab.value).map(post => post.category)))
])

const filteredPosts = computed(() => {
  let list = postsInTab(activeTab.value)

  if (activeCategory.value !== 'ALL') {
    list = list.filter(post => post.category === activeCategory.value)
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(post =>
      [
        post.title,
        post.collection,
        labelPostCollection(post.collection),
        post.category,
        post.deck,
        post.status,
        post.time
      ].some(value => value.toLowerCase().includes(q))
    )
  }

  return list
})

const switchTab = (tab: WritingTab) => {
  activeTab.value = tab
  activeCategory.value = 'ALL'
}

const tabCount = (tab: WritingTab) => postsInTab(tab).length

const categoryCount = (category: string) =>
  category === 'ALL'
    ? postsInTab(activeTab.value).length
    : postsInTab(activeTab.value).filter(post => post.category === category).length
</script>

<template>
  <article>
    <header class="head">
      <span class="kicker">WRITING / 阶段性思考</span>
      <h1 class="display display-xl">DISPATCHES.</h1>
      <p class="lede">
        只写自己真的踩过的坑、真的算过的账、真的纠结过的取舍。短文优先，长文慢做。
      </p>
    </header>

    <div class="search-row">
      <label class="kicker search-label" for="post-search">SEARCH /</label>
      <input
        id="post-search"
        v-model="searchQuery"
        class="search-input"
        type="search"
        placeholder="TITLE / CATEGORY / STATUS"
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

    <nav class="tabs" aria-label="Switch writing type">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-deck">{{ tab.deck }}</span>
        <span class="tab-count">{{ tabCount(tab.id) }}</span>
      </button>
    </nav>

    <nav v-if="categories.length > 1" class="filter" aria-label="Filter writing by category">
      <span class="kicker filter-label">TAG /</span>
      <div class="chips" role="tablist">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="chip"
          role="tab"
          :aria-selected="activeCategory === category"
          :class="{ 'is-active': activeCategory === category }"
          @click="activeCategory = category"
        >
          <span>{{ category }}</span>
          <span class="chip-count">{{ categoryCount(category) }}</span>
        </button>
      </div>
    </nav>

    <section class="stream">
      <ul v-if="filteredPosts.length" class="story-stream" role="list">
        <li
          v-for="(p, i) in filteredPosts"
          :key="p.title"
          class="story-item"
          :data-fill="p.fill"
        >
          <span class="rail-time label-meta">{{ p.time }}</span>
          <article class="story-card">
            <div class="row">
              <span class="kicker tile-kicker">{{ labelPostCollection(p.collection) }} / {{ p.category }}</span>
              <span class="num label-meta">{{ String(i + 1).padStart(2, '0') }} / {{ String(filteredPosts.length).padStart(2, '0') }}</span>
            </div>
            <h2 class="story-title">
              <RouterLink :to="{ name: 'post', params: { slug: p.slug } }">
                {{ p.title }}
              </RouterLink>
            </h2>
            <p class="story-deck">{{ p.deck }}</p>
            <div class="story-actions">
              <RouterLink class="readmore" :to="{ name: 'post', params: { slug: p.slug } }">
                READ →
              </RouterLink>
              <span class="tag tag--ghost">{{ p.status }}</span>
            </div>
          </article>
        </li>
      </ul>
      <p v-else class="empty">
        <span class="label-meta">
          NO MATCHING DISPATCHES
          / {{ tabs.find(tab => tab.id === activeTab)?.label }}
          <template v-if="searchQuery"> / “{{ searchQuery }}”</template>
          YET.
        </span>
      </p>
    </section>

    <p v-if="!posts.length" class="hint">更多文章正在整理中。</p>
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
  letter-spacing: 0.01em;
}
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
.tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: clamp(1rem, 2vw, 1.5rem);
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--hairline-dim);
}
.tab {
  min-width: 0;
  min-height: 86px;
  padding: 0.9rem 1rem;
  border: 1px solid var(--hairline);
  border-radius: 18px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto 1fr;
  gap: 0.35rem 0.75rem;
  text-align: left;
  transition: background var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.tab:hover {
  border-color: var(--mint);
  color: var(--text);
}
.tab.is-active {
  background: var(--mint);
  border-color: var(--mint);
  color: var(--black);
}
.tab-label {
  min-width: 0;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 0.9rem + 0.9vw, 1.65rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.tab-deck {
  grid-column: 1;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-meta);
}
.tab.is-active .tab-deck {
  color: rgba(0, 0, 0, 0.68);
}
.tab-count {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: start;
  min-width: 2rem;
  padding: 0.2rem 0.45rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 999px;
  background: var(--canvas);
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
}
.tab.is-active .tab-count {
  background: var(--black);
  border-color: var(--black);
  color: var(--mint);
}
.filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 0.7rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--hairline-dim);
}
.filter-label {
  color: var(--uv);
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
.chip.is-active {
  background: var(--mint);
  border-color: var(--mint);
  color: var(--black);
}
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
.stream {
  margin-top: clamp(2rem, 3vw, 3rem);
  position: relative;
}
.story-stream {
  list-style: none;
  margin: 0;
  padding: 0 0 0 9rem;
  position: relative;
}
.story-stream::before {
  content: '';
  position: absolute;
  left: 8.4rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--uv-rule) 0 6px,
    transparent 6px 12px
  );
}
.story-item {
  position: relative;
  margin-bottom: 0.9rem;
}
.rail-time {
  position: absolute;
  left: -9rem;
  top: 1.4rem;
  width: 7.5rem;
  text-align: left;
  letter-spacing: 0.18em;
  color: var(--text-meta);
}
.story-item::before {
  content: '';
  position: absolute;
  left: -0.65rem;
  top: 1.6rem;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--canvas);
  border: 1px solid var(--mint);
}
.story-card {
  border-radius: 20px;
  padding: 1.4rem 1.6rem;
  border: 1px solid var(--hairline);
  background: var(--canvas);
  transition: color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}
.story-card:hover .story-title {
  color: var(--hover-blue);
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.6rem;
}
.story-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 1rem + 1vw, 1.9rem);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.005em;
  transition: color var(--dur) var(--ease);
}
.story-title a {
  color: inherit;
}
.story-deck {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.55;
  max-width: 60ch;
}
.readmore {
  display: inline-block;
  margin-top: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mint);
}
.readmore:hover {
  color: var(--hover-blue);
}
.story-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 0.9rem;
}
.story-actions .readmore {
  margin-top: 0;
}

/* fill variants */
.story-item[data-fill='mint'] .story-card {
  background: var(--tile-mint);
  border-color: var(--mint-border);
  color: var(--black);
}
.story-item[data-fill='mint'] .story-deck { color: rgba(0,0,0,0.78); }
.story-item[data-fill='mint'] .story-title { color: var(--black); }
.story-item[data-fill='mint'] .num,
.story-item[data-fill='mint'] .kicker { color: var(--uv); }
.story-item[data-fill='mint'] .readmore { color: var(--uv); }

.story-item[data-fill='uv'] .story-card {
  background: var(--tile-uv);
  border-color: var(--uv-rule);
  color: var(--white);
}
.story-item[data-fill='uv'] .story-deck { color: rgba(255,255,255,0.86); }
.story-item[data-fill='uv'] .story-title { color: var(--white); }
.story-item[data-fill='uv'] .kicker,
.story-item[data-fill='uv'] .readmore { color: var(--mint); }

.hint {
  margin-top: 3rem;
  color: var(--text-meta);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.empty {
  margin: 3rem 0;
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--hairline-dim);
  border-radius: 20px;
}

@media (max-width: 720px) {
  .search-row {
    align-items: stretch;
    flex-direction: column;
  }
  .tabs {
    grid-template-columns: 1fr;
  }
  .search-clear {
    align-self: flex-start;
  }
  .story-stream { padding-left: 1.5rem; }
  .story-stream::before { left: 0.9rem; }
  .rail-time {
    position: static;
    width: auto;
    display: block;
    margin-bottom: 0.5rem;
  }
  .story-item::before { left: 0.65rem; top: 1.1rem; }
}
</style>
