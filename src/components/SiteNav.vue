<script setup lang="ts">
import { RouterLink } from 'vue-router'

const tabs = [
  { to: '/', label: 'HOME' },
  { to: '/writing', label: 'WRITING' },
  { to: '/papers', label: 'READING PAPERS' },
  { to: '/likes', label: 'LIKES' }
]
</script>

<template>
  <header class="nav">
    <div class="inner">
      <RouterLink to="/" class="brand">RODEBIAU</RouterLink>
      <nav aria-label="Main navigation" class="tabs">
        <RouterLink
          v-for="t in tabs"
          :key="t.to"
          :to="t.to"
          class="tab"
          active-class="is-active"
          :exact-active-class="t.to === '/' ? 'is-active' : ''"
        >
          {{ t.label }}
        </RouterLink>
      </nav>
      <a class="cta" href="#" @click.prevent>
        SUBSCRIBE
      </a>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--canvas);
  border-bottom: 1px solid var(--hairline-dim);
}
.inner {
  width: min(1280px, 100% - 2.5rem);
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.brand {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text);
  white-space: nowrap;
}
.brand:hover {
  color: var(--mint);
}
.tabs {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-left: auto;
}
.tab {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.6rem 0.9rem;
  color: var(--text-muted);
  border-radius: 6px;
  transition: color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.tab:hover {
  color: var(--hover-blue);
}
.tab.is-active {
  color: var(--mint);
  box-shadow: 0 -1px 0 0 var(--mint) inset;
}
.cta {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.55rem 1rem;
  border-radius: 24px;
  background: var(--mint);
  color: var(--black);
  white-space: nowrap;
  transition: background var(--dur) var(--ease),
    color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.cta:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--white);
  box-shadow: 0 0 0 1px #c2c2c2 inset;
}
@media (max-width: 760px) {
  .inner {
    height: auto;
    padding: 0.85rem 0;
    flex-wrap: wrap;
    row-gap: 0.6rem;
  }
  .tabs {
    width: 100%;
    margin-left: 0;
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  .cta {
    margin-left: auto;
  }
}
</style>
