<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
const { locale, toggle } = useLocale()
</script>

<template>
  <button
    class="locale-toggle"
    type="button"
    :aria-label="locale === 'zh' ? 'Switch to English' : '切换到中文'"
    @click="toggle"
  >
    <span class="opt" :class="{ on: locale === 'zh' }">中</span>
    <span class="sep" aria-hidden="true">/</span>
    <span class="opt" :class="{ on: locale === 'en' }">EN</span>
  </button>
</template>

<style scoped>
.locale-toggle {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: transparent;
  color: var(--text-meta);
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.locale-toggle:hover {
  border-color: var(--mint);
  color: var(--text);
}
.locale-toggle:focus-visible {
  outline: 2px solid var(--focus-cyan);
  outline-offset: 2px;
}
.opt {
  color: var(--text-meta);
  transition: color var(--dur) var(--ease);
}
.opt.on {
  color: var(--mint);
}
.sep {
  color: var(--hairline-dim);
  opacity: 0.7;
}
</style>
