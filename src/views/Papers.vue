<script setup>
const papers = [
  {
    title: 'SnapKV: LLM Knows What You are Looking for Before Generation',
    venue: 'NEURIPS 2024',
    area: 'KV CACHE',
    status: 'read',
    takeaway:
      '基于 prompt 末段窗口 vote 出关注的 token 位置——简单但偏向 recency；长上下文检索任务上掉得很快。'
  },
  {
    title: 'H2O: Heavy-Hitter Oracle for Efficient Generative Inference of LLMs',
    venue: 'NEURIPS 2023',
    area: 'KV CACHE',
    status: 'read',
    takeaway:
      '“近期 + 累积注意力大者” 的两段式保留，奠定后续 eviction 工作的常见 baseline 形态。'
  },
  {
    title: 'PagedAttention / vLLM',
    venue: 'SOSP 2023',
    area: 'LLM SERVING',
    status: 'read',
    takeaway:
      '把虚拟内存的分页观念搬到 KV cache：碎片消失，共享前缀几乎免费。kernel 设计是真正的工程亮点。'
  },
  {
    title: 'FlashAttention-2',
    venue: 'ARXIV 2023',
    area: 'KERNEL',
    status: 'read',
    takeaway:
      'work partition、warp 调度比 V1 更激进；理解它之后再看 paged 变体会顺很多。'
  },
  {
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    venue: 'COLM 2024',
    area: 'ARCHITECTURE',
    status: 'reading',
    takeaway:
      'selective scan 把 SSM 拉到能和 Transformer 掰手腕；recall 类任务上仍有结构性短板。'
  },
  {
    title: 'Ring Attention with Blockwise Transformers',
    venue: 'ICLR 2024',
    area: 'DISTRIBUTED',
    status: 'queued',
    takeaway:
      '上下文按节点环切，通信与计算流水线化；超长上下文训练绕不开的一篇。'
  }
]

const statusLabel = {
  read: '已读',
  reading: '在读',
  queued: '待读'
}
const counts = {
  read: papers.filter(p => p.status === 'read').length,
  reading: papers.filter(p => p.status === 'reading').length,
  queued: papers.filter(p => p.status === 'queued').length
}
</script>

<template>
  <article>
    <header class="head">
      <span class="kicker kicker-uv">READING&nbsp;PAPERS / 论文阅读</span>
      <h1 class="display display-xl">PAPERS.LOG</h1>
      <p class="lede">
        围绕 LLM 推理、KV cache、kernel 与系统优化整理的阅读清单。每篇尝试用一句话写清楚“它解决了什么、留下了什么”。
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

    <ul class="papers" role="list">
      <li
        v-for="p in papers"
        :key="p.title"
        class="paper"
        :data-status="p.status"
      >
        <div class="paper-meta">
          <span class="dot" :class="p.status"></span>
          <span class="label-meta">{{ p.venue }}</span>
          <span class="sep">·</span>
          <span class="label-meta">{{ p.area }}</span>
          <span class="sep">·</span>
          <span class="label-meta status-tag">{{ statusLabel[p.status] }}</span>
        </div>
        <h2 class="paper-title">{{ p.title }}</h2>
        <p class="paper-take">{{ p.takeaway }}</p>
      </li>
    </ul>
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
  transition: color var(--dur) var(--ease);
}
.paper:hover .paper-title { color: var(--hover-blue); }
.paper-take {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 70ch;
}
</style>
