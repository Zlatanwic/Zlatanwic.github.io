<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findPost } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug)))
</script>

<template>
  <article v-if="post" class="post-page">
    <RouterLink class="back-link" to="/writing">← BACK TO WRITING</RouterLink>

    <header class="post-head">
      <div class="post-meta">
        <span class="kicker kicker-uv">{{ post.category }}</span>
        <span class="label-meta">{{ post.time }}</span>
        <span class="tag tag--ghost">{{ post.status }}</span>
      </div>
      <h1 class="display display-xl">{{ post.title }}</h1>
      <p v-if="post.deck" class="lede">{{ post.deck }}</p>
    </header>

    <section class="post-body" v-html="post.html" />
  </article>

  <article v-else class="post-missing">
    <RouterLink class="back-link" to="/writing">← BACK TO WRITING</RouterLink>
    <h1 class="display display-lg">POST NOT FOUND</h1>
    <p class="lede">This dispatch does not exist yet.</p>
  </article>
</template>

<style scoped>
.post-page,
.post-missing {
  max-width: 860px;
}
.back-link {
  display: inline-block;
  margin-bottom: 1.4rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--mint);
}
.post-head {
  display: grid;
  gap: 1rem;
  padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--hairline-dim);
}
.post-head h1 {
  margin: 0;
}
.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
}
.post-body {
  padding-top: clamp(1.8rem, 3vw, 3rem);
  color: var(--text-muted);
  font-size: 1.02rem;
  line-height: 1.72;
}
.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
  color: var(--text);
  line-height: 1.08;
  margin: 2rem 0 0.8rem;
}
.post-body :deep(h1) {
  display: none;
}
.post-body :deep(h2) {
  font-size: clamp(1.4rem, 1rem + 1.5vw, 2.2rem);
}
.post-body :deep(p) {
  margin: 0 0 1rem;
}
.post-body :deep(a) {
  color: var(--mint);
  border-bottom: 1px solid transparent;
}
.post-body :deep(a:hover) {
  color: var(--hover-blue);
  border-bottom-color: var(--hover-blue);
}
.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.2rem;
}
.post-body :deep(li) {
  margin-bottom: 0.5rem;
}
.post-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--mint);
  background: var(--slate);
  border: 1px solid var(--hairline-dim);
  border-radius: 4px;
  padding: 0.08rem 0.3rem;
}
.post-body :deep(pre) {
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid var(--hairline);
  border-radius: 20px;
  background: var(--canvas);
}
.post-body :deep(pre code) {
  display: block;
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 0;
}
</style>
