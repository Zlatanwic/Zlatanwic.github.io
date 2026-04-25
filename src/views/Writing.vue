<script setup lang="ts">
const posts = [
  {
    time: '2026 · 03 · 24',
    fill: 'dark',
    tag: '工程',
    title: '用 Vue 重写个人站点的几条原则',
    deck: '从 VitePress 迁回 Vue + Vite 的取舍：内容更少、结构更紧、首页只回答一件事——“你是谁，在做什么”。'
  },
  {
    time: '2026 · 02 · 18',
    fill: 'mint',
    tag: 'MLSYS',
    title: 'KV CACHE 驱逐：从启发式到语义信号',
    deck: 'SnapKV、H2O 这些基于注意力分数的策略到底丢掉了什么？记一些在 SieveKV 实验里观察到的现象。'
  },
  {
    time: '2026 · 01 · 09',
    fill: 'dark',
    tag: 'CUDA',
    title: 'PAGED ATTENTION 的访存账',
    deck: '把 gather + attention 合成一个 kernel，看 Nsight 学到的几件事：occupancy 不是越高越好。'
  },
  {
    time: '2025 · 12 · 02',
    fill: 'uv',
    tag: 'SYSTEMS',
    title: '为什么我又写了一个内核',
    deck: 'NovaOS 不是为了发明新东西。它是为了让我对着每一行 unsafe 都说得清楚“为什么这里必须不安全”。'
  }
]
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

    <section class="stream">
      <ul class="story-stream" role="list">
        <li
          v-for="(p, i) in posts"
          :key="p.title"
          class="story-item"
          :data-fill="p.fill"
        >
          <span class="rail-time label-meta">{{ p.time }}</span>
          <article class="story-card">
            <div class="row">
              <span class="kicker tile-kicker">{{ p.tag }}</span>
              <span class="num label-meta">{{ String(i + 1).padStart(2, '0') }} / {{ String(posts.length).padStart(2, '0') }}</span>
            </div>
            <h2 class="story-title">{{ p.title }}</h2>
            <p class="story-deck">{{ p.deck }}</p>
            <a class="readmore" href="#" @click.prevent>READ →</a>
          </article>
        </li>
      </ul>
    </section>

    <p class="hint">更多文章正在整理中。</p>
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

@media (max-width: 720px) {
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
