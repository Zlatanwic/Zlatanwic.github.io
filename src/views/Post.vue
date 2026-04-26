<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findPost, labelPostCollection } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug)))
</script>

<template>
  <article v-if="post" class="post-page">
    <RouterLink class="back-link" to="/writing">← BACK TO WRITING</RouterLink>

    <header class="post-head">
      <div class="post-meta">
        <span class="kicker">{{ labelPostCollection(post.collection) }}</span>
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
  max-width: 920px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.4rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--mint);
  text-transform: uppercase;
  border-bottom: 1px solid transparent;
}
.back-link:hover {
  border-bottom-color: var(--hover-blue);
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
  position: relative;
  margin-top: clamp(1.8rem, 3vw, 3rem);
  padding: clamp(1.2rem, 2vw, 1.8rem);
  border: 1px solid var(--hairline-dim);
  border-radius: 24px;
  background:
    linear-gradient(90deg, rgba(60, 255, 208, 0.08), transparent 34rem),
    var(--canvas);
  color: var(--text-muted);
  font-size: clamp(1rem, 0.98rem + 0.12vw, 1.08rem);
  line-height: 1.78;
  overflow: hidden;
}
.post-body::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: linear-gradient(
    to bottom,
    var(--mint),
    var(--uv) 45%,
    transparent
  );
}
.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3),
.post-body :deep(h4) {
  color: var(--text);
  line-height: 1.12;
  scroll-margin-top: 2rem;
}
.post-body :deep(h1) {
  display: none;
}
.post-body :deep(h2) {
  position: relative;
  margin: 2.4rem 0 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--hairline-dim);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 1.1rem + 1.6vw, 2.45rem);
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
.post-body :deep(h2:first-child),
.post-body :deep(h1 + h2) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.post-body :deep(h2::before) {
  content: '';
  display: inline-block;
  width: 0.72rem;
  height: 0.72rem;
  margin-right: 0.65rem;
  border-radius: 50%;
  background: var(--mint);
  vertical-align: 0.08em;
}
.post-body :deep(h3) {
  margin: 1.8rem 0 0.65rem;
  font-family: var(--font-sans);
  font-size: clamp(1.18rem, 1.02rem + 0.45vw, 1.42rem);
  font-weight: 800;
}
.post-body :deep(h4) {
  margin: 1.4rem 0 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.86rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mint);
}
.post-body :deep(p) {
  margin: 0 0 1.05rem;
  max-width: 72ch;
}
.post-body :deep(strong) {
  color: var(--text);
  font-weight: 800;
}
.post-body :deep(em) {
  color: var(--white);
  font-family: var(--font-serif);
}
.post-body :deep(a) {
  color: var(--mint);
  border-bottom: 1px solid transparent;
}
.post-body :deep(a:hover) {
  color: var(--hover-blue);
  border-bottom-color: var(--hover-blue);
}
.post-body :deep(blockquote) {
  margin: 1.4rem 0;
  padding: 1rem 1.1rem 1rem 1.25rem;
  border-left: 3px solid var(--mint);
  border-radius: 0 18px 18px 0;
  background: rgba(255, 255, 255, 0.045);
  color: var(--text);
}
.post-body :deep(blockquote p:last-child) {
  margin-bottom: 0;
}
.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 1rem 0 1.25rem;
  padding-left: 0;
  display: grid;
  gap: 0.45rem;
  max-width: 72ch;
}
.post-body :deep(ul) {
  list-style: none;
}
.post-body :deep(ol) {
  list-style: decimal;
  padding-left: 1.4rem;
}
.post-body :deep(li) {
  margin: 0;
  padding-left: 0.9rem;
}
.post-body :deep(ul > li) {
  position: relative;
}
.post-body :deep(ul > li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.78em;
  width: 8px;
  height: 2px;
  background: var(--mint);
}
.post-body :deep(li > ul),
.post-body :deep(li > ol) {
  margin: 0.45rem 0 0.2rem;
}
.post-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  color: var(--mint);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--hairline-dim);
  border-radius: 6px;
  padding: 0.1rem 0.35rem;
}
.post-body :deep(pre) {
  overflow-x: auto;
  margin: 1.35rem 0;
  padding: 1.15rem 1.2rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 18px;
  background: #0b0b0b;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.post-body :deep(pre code) {
  display: block;
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  border-radius: 0;
  line-height: 1.65;
}
.post-body :deep(hr) {
  height: 1px;
  margin: 2rem 0;
  border: 0;
  background: repeating-linear-gradient(
    to right,
    var(--hairline-dim) 0 10px,
    transparent 10px 18px
  );
}
.post-body :deep(img) {
  width: 100%;
  margin: 1.4rem 0;
  border: 1px solid var(--hairline-dim);
  border-radius: 18px;
  background: var(--tile-white);
}
.post-body :deep(table) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 1.4rem 0;
  overflow-x: auto;
  border-collapse: collapse;
  font-size: 0.92rem;
}
.post-body :deep(th),
.post-body :deep(td) {
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--hairline-dim);
  vertical-align: top;
}
.post-body :deep(th) {
  color: var(--black);
  background: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.post-body :deep(td) {
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.025);
}

@media (max-width: 720px) {
  .post-body {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    padding: 1rem;
    border-radius: 18px;
  }
  .post-body :deep(h2::before) {
    width: 0.58rem;
    height: 0.58rem;
    margin-right: 0.5rem;
  }
}
</style>
