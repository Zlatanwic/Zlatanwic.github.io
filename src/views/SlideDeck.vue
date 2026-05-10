<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findSlideDeck } from '../data/slides'
import type { SlideBlock } from '../data/slides'

const route = useRoute()
const activeIndex = ref(0)

const deck = computed(() => findSlideDeck(String(route.params.slug)))
const total = computed(() => deck.value?.slides.length ?? 0)
const currentSlide = computed(() => deck.value?.slides[activeIndex.value])
const progress = computed(() =>
  total.value ? `${((activeIndex.value + 1) / total.value) * 100}%` : '0%'
)

const goTo = (index: number) => {
  if (!total.value) return
  activeIndex.value = Math.min(Math.max(index, 0), total.value - 1)
}

const next = () => goTo(activeIndex.value + 1)
const previous = () => goTo(activeIndex.value - 1)

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isTypingTarget(event.target)) return

  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault()
    next()
    return
  }

  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault()
    previous()
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    goTo(0)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    goTo(total.value - 1)
    return
  }

}

const blockTone = (block: SlideBlock) => {
  if (block.type === 'table') return 'dense'
  if (block.type === 'code') return 'code'
  if (block.type === 'quote') return 'quote'
  return 'plain'
}

watch(
  () => route.params.slug,
  () => {
    activeIndex.value = 0
  }
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <article v-if="deck" class="deck-page">
    <header class="deck-top">
      <div class="deck-title">
        <RouterLink class="back-link" to="/">BACK HOME</RouterLink>
        <span class="kicker kicker-uv">{{ deck.kicker }}</span>
        <h1 class="display deck-heading">{{ deck.title }}</h1>
        <p v-if="deck.subtitle" class="deck-subtitle">{{ deck.subtitle }}</p>
      </div>
      <div class="deck-meta">
        <span v-if="deck.date" class="label-meta">{{ deck.date }}</span>
        <span class="label-meta">{{ activeIndex + 1 }} / {{ total }}</span>
      </div>
    </header>

    <div class="deck-progress" aria-hidden="true">
      <span :style="{ width: progress }"></span>
    </div>

    <div class="deck-stage">
      <aside class="slide-rail" aria-label="Slides">
        <button
          v-for="slide in deck.slides"
          :key="slide.index"
          type="button"
          class="slide-dot"
          :class="{ 'is-active': slide.index === activeIndex, 'is-backup': slide.section === 'backup' }"
          :aria-label="`Go to slide ${slide.index + 1}: ${slide.displayTitle}`"
          :aria-current="slide.index === activeIndex ? 'step' : undefined"
          @click="goTo(slide.index)"
        >
          {{ slide.number || String(slide.index + 1).padStart(2, '0') }}
        </button>
      </aside>

      <section v-if="currentSlide" class="slide-frame" aria-live="polite">
        <div class="slide-shell" :data-section="currentSlide.section">
          <div class="slide-chrome">
            <span class="label-meta">{{ currentSlide.section === 'backup' ? 'BACKUP' : 'SIEVEKV' }}</span>
            <span v-if="currentSlide.time" class="label-meta">{{ currentSlide.time }}</span>
          </div>

          <div class="slide-layout">
            <header class="slide-head">
              <span class="slide-number">{{ currentSlide.number }}</span>
              <h2>{{ currentSlide.displayTitle }}</h2>
            </header>

            <div class="slide-blocks">
              <template v-for="(block, blockIndex) in currentSlide.blocks" :key="blockIndex">
                <p v-if="block.type === 'paragraph'" class="slide-paragraph" :data-tone="blockTone(block)">
                  <template v-for="(token, tokenIndex) in block.tokens" :key="tokenIndex">
                    <code v-if="token.kind === 'code'">{{ token.text }}</code>
                    <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                    <span v-else>{{ token.text }}</span>
                  </template>
                </p>

                <blockquote v-else-if="block.type === 'quote'" class="slide-quote">
                  <template v-for="(token, tokenIndex) in block.tokens" :key="tokenIndex">
                    <code v-if="token.kind === 'code'">{{ token.text }}</code>
                    <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                    <span v-else>{{ token.text }}</span>
                  </template>
                </blockquote>

                <pre v-else-if="block.type === 'code'" class="slide-code"><code>{{ block.code }}</code></pre>

                <img
                  v-else-if="block.type === 'image'"
                  class="slide-image"
                  :src="block.src"
                  :alt="block.alt"
                >

                <ol v-else-if="block.type === 'list' && block.ordered" class="slide-list">
                  <li
                    v-for="(item, itemIndex) in block.items"
                    :key="itemIndex"
                    :style="{ '--level': item.level }"
                  >
                    <template v-for="(token, tokenIndex) in item.tokens" :key="tokenIndex">
                      <code v-if="token.kind === 'code'">{{ token.text }}</code>
                      <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                      <span v-else>{{ token.text }}</span>
                    </template>
                  </li>
                </ol>

                <ul v-else-if="block.type === 'list'" class="slide-list">
                  <li
                    v-for="(item, itemIndex) in block.items"
                    :key="itemIndex"
                    :style="{ '--level': item.level }"
                  >
                    <template v-for="(token, tokenIndex) in item.tokens" :key="tokenIndex">
                      <code v-if="token.kind === 'code'">{{ token.text }}</code>
                      <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                      <span v-else>{{ token.text }}</span>
                    </template>
                  </li>
                </ul>

                <div v-else-if="block.type === 'table'" class="slide-table-wrap">
                  <table class="slide-table">
                    <thead>
                      <tr>
                        <th v-for="(cell, cellIndex) in block.headers" :key="cellIndex">
                          <template v-for="(token, tokenIndex) in cell" :key="tokenIndex">
                            <code v-if="token.kind === 'code'">{{ token.text }}</code>
                            <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                            <span v-else>{{ token.text }}</span>
                          </template>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                          <template v-for="(token, tokenIndex) in cell" :key="tokenIndex">
                            <code v-if="token.kind === 'code'">{{ token.text }}</code>
                            <strong v-else-if="token.kind === 'strong'">{{ token.text }}</strong>
                            <span v-else>{{ token.text }}</span>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>

    <nav class="deck-controls" aria-label="Slide navigation">
      <button
        class="nav-button"
        type="button"
        aria-label="Previous slide"
        :disabled="activeIndex === 0"
        @click="previous"
      >
        &lt;
      </button>
      <span class="label-meta">{{ currentSlide?.displayTitle }}</span>
      <button
        class="nav-button"
        type="button"
        aria-label="Next slide"
        :disabled="activeIndex === total - 1"
        @click="next"
      >
        &gt;
      </button>
    </nav>
  </article>

  <article v-else class="deck-missing">
    <RouterLink class="back-link" to="/">BACK HOME</RouterLink>
    <h1 class="display deck-heading">DECK NOT FOUND</h1>
    <p class="deck-subtitle">This slide deck does not exist yet.</p>
  </article>
</template>

<style scoped>
.deck-page,
.deck-missing {
  display: grid;
  gap: 1.2rem;
}

.deck-top {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1.5rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--hairline-dim);
}

.deck-title {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.back-link {
  width: fit-content;
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px solid transparent;
}

.back-link:hover,
.back-link:focus-visible {
  color: var(--hover-blue);
  border-bottom-color: var(--hover-blue);
  outline: none;
}

.deck-heading {
  margin: 0;
  max-width: 18ch;
  font-size: 3.6rem;
  overflow-wrap: anywhere;
}

.deck-subtitle {
  margin: 0;
  max-width: 72ch;
  color: var(--text-muted);
  line-height: 1.55;
}

.deck-meta {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
}

.deck-progress {
  height: 4px;
  background: var(--hairline-dim);
  overflow: hidden;
}

.deck-progress span {
  display: block;
  height: 100%;
  background: var(--mint);
  transition: width 220ms var(--ease);
}

.deck-stage {
  display: grid;
  grid-template-columns: 4.4rem minmax(0, 1fr);
  gap: 1rem;
  align-items: stretch;
}

.slide-rail {
  display: grid;
  align-content: start;
  gap: 0.45rem;
}

.slide-dot {
  min-width: 0;
  min-height: 2.15rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 8px;
  background: transparent;
  color: var(--text-meta);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}

.slide-dot:hover,
.slide-dot:focus-visible {
  border-color: var(--mint);
  color: var(--mint);
  outline: none;
}

.slide-dot.is-active {
  background: var(--mint);
  border-color: var(--mint);
  color: var(--black);
}

.slide-dot.is-backup:not(.is-active) {
  border-style: dashed;
  color: var(--tile-yellow);
}

.slide-frame {
  min-height: min(68dvh, 760px);
  aspect-ratio: 16 / 9;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  background: var(--black);
  overflow: hidden;
  display: grid;
}

.slide-shell {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  background:
    linear-gradient(90deg, rgba(60, 255, 208, 0.13), transparent 36%),
    var(--black);
}

.slide-shell[data-section='backup'] {
  background:
    linear-gradient(90deg, rgba(245, 208, 0, 0.14), transparent 34%),
    var(--black);
}

.slide-chrome {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.45rem 0;
}

.slide-layout {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  padding: 1.4rem 3rem 2.7rem;
}

.slide-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.slide-number {
  width: 3.2rem;
  height: 3.2rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--mint);
  border-radius: 999px;
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 800;
}

.slide-head h2 {
  margin: 0;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 2vw + 1.3rem, 4.3rem);
  line-height: 0.98;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.slide-blocks {
  min-width: 0;
  display: grid;
  align-content: center;
  gap: 0.9rem;
}

.slide-paragraph {
  margin: 0;
  max-width: 62ch;
  color: var(--text-muted);
  font-size: clamp(1.02rem, 0.45vw + 0.95rem, 1.34rem);
  line-height: 1.42;
}

.slide-quote {
  margin: 0;
  max-width: 58ch;
  padding: 1rem 1.15rem;
  border-left: 4px solid var(--mint);
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
  font-size: 1.35rem;
  line-height: 1.45;
}

.slide-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.58rem;
  max-width: 68ch;
  color: var(--text-muted);
  font-size: clamp(0.95rem, 0.42vw + 0.9rem, 1.22rem);
  line-height: 1.34;
}

.slide-list li {
  position: relative;
  padding-left: calc(1.15rem + var(--level, 0) * 1.15rem);
}

.slide-list li::before {
  content: '';
  position: absolute;
  left: calc(var(--level, 0) * 1.15rem);
  top: 0.68em;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--mint);
}

ol.slide-list {
  counter-reset: slide-list;
}

ol.slide-list li {
  counter-increment: slide-list;
}

ol.slide-list li::before {
  content: counter(slide-list);
  top: 0.08em;
  width: 1.35rem;
  height: 1.35rem;
  display: grid;
  place-items: center;
  background: var(--mint);
  color: var(--black);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
}

.slide-code {
  margin: 0;
  max-width: 100%;
  overflow: auto;
  padding: 1rem 1.1rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 8px;
  background: #090909;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: clamp(0.82rem, 0.22vw + 0.78rem, 1rem);
  line-height: 1.5;
}

.slide-image {
  max-height: 48dvh;
  object-fit: contain;
  border: 1px solid var(--hairline-dim);
  border-radius: 8px;
  background: var(--tile-white);
}

.slide-table-wrap {
  max-width: 100%;
  overflow: auto;
}

.slide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.76rem, 0.2vw + 0.74rem, 0.95rem);
  line-height: 1.3;
}

.slide-table th,
.slide-table td {
  padding: 0.58rem 0.68rem;
  border: 1px solid var(--hairline-dim);
  text-align: left;
  vertical-align: top;
}

.slide-table th {
  background: var(--mint);
  color: var(--black);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.slide-table td {
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.035);
}

strong {
  color: var(--mint);
  font-weight: 800;
}

code {
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.92em;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--hairline-dim);
  border-radius: 6px;
  padding: 0.05rem 0.28rem;
}

.deck-controls {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
}

.deck-controls .label-meta {
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
}

.nav-button {
  width: 2.7rem;
  height: 2.7rem;
  border: 1px solid var(--mint);
  border-radius: 999px;
  background: transparent;
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  transition: background var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}

.nav-button:hover,
.nav-button:focus-visible {
  background: var(--mint);
  color: var(--black);
  outline: none;
}

.nav-button:disabled {
  cursor: not-allowed;
  border-color: var(--hairline-dim);
  color: var(--text-meta);
  background: transparent;
}

@media (max-width: 1100px) {
  .deck-stage {
    grid-template-columns: 1fr;
  }

  .slide-rail {
    grid-template-columns: repeat(auto-fit, minmax(2.4rem, 1fr));
  }
}

@media (max-width: 720px) {
  .deck-top {
    align-items: start;
    flex-direction: column;
  }

  .deck-meta {
    justify-content: flex-start;
  }

  .deck-heading {
    font-size: 2.5rem;
  }

  .slide-frame {
    min-height: 560px;
    aspect-ratio: auto;
  }

  .slide-layout {
    padding: 1.2rem 1.2rem 1.6rem;
  }

  .slide-head {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .slide-number {
    width: 2.5rem;
    height: 2.5rem;
  }

  .slide-head h2 {
    font-size: 2rem;
  }
}
</style>
