<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteNav from './components/SiteNav.vue'
</script>

<template>
  <div class="shell">
    <SiteNav />
    <main class="page">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer class="foot">
      <span class="label-meta">© 2026 — RODEBIAU / 李阔</span>
      <a class="label-meta foot-link" href="https://github.com/Zlatanwic" target="_blank" rel="noreferrer">
        GITHUB ↗
      </a>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--canvas);
}
.page {
  flex: 1;
  width: min(1280px, 100% - 2.5rem);
  margin: 0 auto;
  padding: clamp(2rem, 3vw, 4rem) 0 6rem;
}
.foot {
  border-top: 1px solid var(--hairline-dim);
  padding: 1.5rem clamp(1.25rem, 4vw, 3rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.foot-link {
  color: var(--text-meta);
}
.foot-link:hover {
  color: var(--mint);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms var(--ease), transform 220ms var(--ease);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
