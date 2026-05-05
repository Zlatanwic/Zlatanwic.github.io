<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findAdjacentPosts, findPost, labelPostCollection } from '../data/posts'
import type { PostTocItem } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug)))
const adjacentPosts = computed(() => findAdjacentPosts(String(route.params.slug)))

interface TocGroup {
  heading: PostTocItem
  children: PostTocItem[]
}

const collapsedToc = ref<Set<string>>(new Set())

const tocGroups = computed<TocGroup[]>(() => {
  const groups: TocGroup[] = []

  for (const item of post.value?.toc ?? []) {
    if (item.level === 2 || !groups.length) {
      groups.push({ heading: item, children: [] })
      continue
    }

    groups[groups.length - 1].children.push(item)
  }

  return groups
})

const isCollapsed = (id: string) => collapsedToc.value.has(id)

const toggleTocGroup = (id: string) => {
  const next = new Set(collapsedToc.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  collapsedToc.value = next
}
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

    <div class="post-layout">
      <div class="post-main">
        <section class="post-body" v-html="post.html" />

        <nav
          v-if="adjacentPosts.previous || adjacentPosts.next"
          class="post-pager"
          aria-label="Adjacent chapters"
        >
          <RouterLink
            v-if="adjacentPosts.previous"
            class="pager-link pager-link--prev"
            :to="{ name: 'post', params: { slug: adjacentPosts.previous.slug } }"
          >
            <span class="pager-eyebrow">PREVIOUS / 上一章</span>
            <span class="pager-title">{{ adjacentPosts.previous.title }}</span>
            <span class="pager-meta">{{ labelPostCollection(adjacentPosts.previous.collection) }}</span>
          </RouterLink>
          <span v-else class="pager-link pager-link--empty" aria-hidden="true" />

          <RouterLink
            v-if="adjacentPosts.next"
            class="pager-link pager-link--next"
            :to="{ name: 'post', params: { slug: adjacentPosts.next.slug } }"
          >
            <span class="pager-eyebrow">NEXT / 下一章</span>
            <span class="pager-title">{{ adjacentPosts.next.title }}</span>
            <span class="pager-meta">{{ labelPostCollection(adjacentPosts.next.collection) }}</span>
          </RouterLink>
          <span v-else class="pager-link pager-link--empty" aria-hidden="true" />
        </nav>
      </div>

      <aside v-if="tocGroups.length" class="post-toc" aria-label="Article headings">
        <span class="toc-kicker">ON THIS PAGE</span>
        <nav class="toc-nav">
          <div v-for="group in tocGroups" :key="group.heading.id" class="toc-group">
            <div class="toc-row">
              <a class="toc-link toc-link--h2" :href="`#${group.heading.id}`">
                {{ group.heading.title }}
              </a>
              <button
                v-if="group.children.length"
                class="toc-toggle"
                type="button"
                :aria-label="`${isCollapsed(group.heading.id) ? 'Expand' : 'Collapse'} ${group.heading.title}`"
                :aria-expanded="!isCollapsed(group.heading.id)"
                @click="toggleTocGroup(group.heading.id)"
              >
                {{ isCollapsed(group.heading.id) ? '+' : '-' }}
              </button>
            </div>
            <div
              v-if="group.children.length"
              class="toc-children-wrap"
              :class="{ 'is-collapsed': isCollapsed(group.heading.id) }"
            >
              <div class="toc-children">
                <a
                  v-for="child in group.children"
                  :key="child.id"
                  class="toc-link toc-link--h3"
                  :href="`#${child.id}`"
                >
                  {{ child.title }}
                </a>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </div>
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
  max-width: 1180px;
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
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 920px) minmax(190px, 240px);
  gap: clamp(1.2rem, 3vw, 2.4rem);
  align-items: start;
}
.post-main {
  min-width: 0;
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
.post-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 0.95rem;
}
.pager-link {
  min-width: 0;
  min-height: 112px;
  padding: 1rem 1.05rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 18px;
  background: var(--canvas);
  display: grid;
  align-content: center;
  gap: 0.45rem;
  color: var(--text);
  transition: border-color var(--dur) var(--ease),
    background var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.pager-link:hover {
  border-color: var(--mint);
  background: rgba(255, 255, 255, 0.035);
  transform: translateY(-2px);
}
.pager-link--next {
  justify-items: end;
  text-align: right;
}
.pager-link--empty {
  visibility: hidden;
  pointer-events: none;
}
.pager-eyebrow,
.pager-meta {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.pager-eyebrow {
  color: var(--mint);
}
.pager-meta {
  color: var(--text-meta);
}
.pager-title {
  min-width: 0;
  color: var(--text);
  font-size: clamp(1rem, 0.9rem + 0.35vw, 1.2rem);
  font-weight: 800;
  line-height: 1.28;
  overflow-wrap: anywhere;
}
.post-toc {
  position: sticky;
  top: 1.2rem;
  margin-top: clamp(1.8rem, 3vw, 3rem);
  padding: 1rem 0 1rem 1rem;
  border-left: 1px solid var(--hairline-dim);
  max-height: calc(100dvh - 2.4rem);
  overflow: auto;
}
.toc-kicker {
  display: block;
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mint);
}
.toc-nav {
  display: grid;
  gap: 0.65rem;
}
.toc-group {
  display: grid;
  gap: 0.4rem;
}
.toc-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.55rem;
}
.toc-link {
  display: block;
  padding: 0.26rem 0;
  color: var(--text-meta);
  font-family: var(--font-mono);
  font-size: 0.86rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
  border-bottom: 1px solid transparent;
  transition: color var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.toc-link:hover {
  color: var(--mint);
  border-bottom-color: var(--mint);
  transform: translateX(2px);
}
.toc-link--h2 {
  color: var(--text-muted);
}
.toc-link--h3 {
  padding-left: 0.95rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}
.toc-children-wrap {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
  transition: grid-template-rows 240ms var(--ease),
    opacity 180ms var(--ease),
    transform 240ms var(--ease);
}
.toc-children-wrap.is-collapsed {
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-4px);
}
.toc-children {
  min-height: 0;
  overflow: hidden;
  display: grid;
  gap: 0.18rem;
  border-left: 1px dashed var(--hairline-dim);
  margin-left: 0.2rem;
}
.toc-toggle {
  width: 1.55rem;
  height: 1.55rem;
  border: 1px solid var(--hairline-dim);
  border-radius: 999px;
  background: transparent;
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}
.toc-toggle:hover {
  background: var(--mint);
  border-color: var(--mint);
  color: var(--black);
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
.post-body :deep(.katex) {
  color: var(--text);
  font-size: 1.04em;
}
.post-body :deep(.math-block) {
  margin: 1.4rem 0;
  padding: 1rem 1.1rem;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid var(--hairline-dim);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);
  max-width: 100%;
}
.post-body :deep(.math-block .katex-display) {
  margin: 0;
  padding: 0;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  text-align: center;
}
.post-body :deep(.math-block .katex-display > .katex) {
  display: inline-block;
  min-width: max-content;
}
.post-body :deep(.katex-error) {
  color: var(--tile-pink);
}
.post-body :deep(pre) {
  position: relative;
  overflow-x: auto;
  margin: 1.45rem 0;
  padding: 3rem 1.25rem 1.2rem;
  border: 1px solid var(--hairline-dim);
  border-left: 4px solid var(--mint);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 3.05rem),
    #090909;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 40px rgba(0, 0, 0, 0.24);
  scrollbar-color: var(--mint) #171717;
  scrollbar-width: thin;
}
.post-body :deep(pre::before) {
  content: 'CODE';
  position: absolute;
  left: 1.15rem;
  top: 0.95rem;
  color: var(--text-meta);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}
.post-body :deep(pre::after) {
  content: '';
  position: absolute;
  right: 1.1rem;
  top: 1.05rem;
  width: 0.46rem;
  height: 0.46rem;
  border-radius: 999px;
  background: var(--mint);
  box-shadow:
    -0.82rem 0 0 var(--tile-yellow),
    -1.64rem 0 0 var(--tile-pink);
}
.post-body :deep(pre::-webkit-scrollbar) {
  height: 10px;
}
.post-body :deep(pre::-webkit-scrollbar-track) {
  background: #171717;
  border-radius: 999px;
}
.post-body :deep(pre::-webkit-scrollbar-thumb) {
  background: var(--mint);
  border: 2px solid #171717;
  border-radius: 999px;
}
.post-body :deep(pre code) {
  display: block;
  padding: 0;
  min-width: max-content;
  color: #f3f3f3;
  background: transparent;
  border: 0;
  border-radius: 0;
  font-size: 0.9rem;
  line-height: 1.72;
  tab-size: 2;
  white-space: pre;
}
.post-body :deep(pre code .token.comment),
.post-body :deep(pre code .token.prolog),
.post-body :deep(pre code .token.doctype) {
  color: var(--text-meta);
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
  .post-layout {
    grid-template-columns: 1fr;
  }
  .post-toc {
    position: static;
    order: -1;
    margin-top: 1rem;
    padding: 0.9rem 1rem;
    border: 1px solid var(--hairline-dim);
    border-radius: 18px;
    max-height: none;
  }
  .toc-nav {
    grid-template-columns: 1fr;
  }
  .post-body {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    padding: 1rem;
    border-radius: 18px;
  }
  .post-pager {
    grid-template-columns: 1fr;
  }
  .pager-link--next {
    justify-items: start;
    text-align: left;
  }
  .pager-link--empty {
    display: none;
  }
  .post-body :deep(h2::before) {
    width: 0.58rem;
    height: 0.58rem;
    margin-right: 0.5rem;
  }
}
</style>
