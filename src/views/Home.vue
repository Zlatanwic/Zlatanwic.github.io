<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import LocaleToggle from '../components/LocaleToggle.vue'

const { locale } = useLocale()

const i18n = {
  zh: {
    affil: '同济大学 · 大三 · AI SYSTEMS',
    name: 'LI KUO',
    pull: '— 在人工智能与计算机系统之间。',
    tagline: 'AI SYSTEM · MLSYS · LLM INFERENCE · OS · DISTRIBUTED',
    nowKicker: 'NOW / 2026',
    now: [
      { strong: 'ACMMM 2026', body: '以第一作者投稿，low-level vision 方向' },
      { strong: 'ICIC 2026', body: '以第一作者投稿，KV cache 管理方向' },
      { strong: 'NovaOS', body: '持续迭代，向更完整的 POSIX 兼容靠拢' }
    ],
    workKicker: 'SELECTED WORK',
    workTitle: 'PROJECTS'
  },
  en: {
    affil: 'TONGJI UNIVERSITY · JUNIOR · AI SYSTEMS',
    name: 'LI KUO',
    pull: '— between AI and SYSTEM.',
    tagline: 'AI SYSTEM · MLSYS · LLM INFERENCE · OS · DISTRIBUTED',
    nowKicker: 'NOW / 2026',
    now: [
      { strong: 'ACMMM 2026', body: 'first-author submission, low-level vision' },
      { strong: 'ICIC 2026', body: 'first-author submission, KV cache management' },
      { strong: 'NovaOS', body: 'iterating toward fuller POSIX compatibility' }
    ],
    workKicker: 'SELECTED WORK',
    workTitle: 'PROJECTS'
  }
}

const projects = [
  {
    fill: 'mint',
    name: 'SIEVEKV',
    kicker: { zh: '2026.03 · ICIC 2026 · 独立一作', en: '2026.03 · ICIC 2026 · SOLE FIRST AUTHOR' },
    summary: {
      zh: '面向长上下文推理的语义感知 KV Cache 驱逐策略。融合注意力质量、头熵、信息密度、查询相关度与事实似然五维信号。',
      en: 'Semantic-aware KV cache eviction for long-context inference. Fuses five lightweight signals: attention quality, head entropy, information density, query relevance, and factual likelihood.'
    },
    bullets: {
      zh: [
        'b=20% 预算下达 70% 准确率，超 SnapKV 40pp',
        '32K tokens 上下文仍维持 90% 准确率',
        '系统开销 8.86 ms/步，占解码时间 <4%'
      ],
      en: [
        '70% accuracy at b=20% budget, +40pp over SnapKV',
        '90% accuracy preserved at 32K-token context',
        '8.86 ms/step overhead — <4% of decode time'
      ]
    },
    stack: ['PYTHON', 'PYTORCH', 'QWEN2.5', 'LLAMA-3.2']
  },
  {
    fill: 'uv',
    name: 'FUSED CUDA KERNEL for PAGED KV CACHE',
    kicker: { zh: '2025 · 个人项目', en: '2025 · INDEPENDENT PROJECT' },
    summary: {
      zh: '面向长上下文 LLM decode 的 paged attention kernel：把 “两阶段 gather + attention” 重构为 fused kernel。',
      en: 'Paged attention kernel for long-context LLM decoding — fuses the two-stage gather + attention path into a single CUDA kernel.'
    },
    bullets: {
      zh: [
        '相较 PyTorch 基线 2.0–3.7× 加速',
        'Nsight 实测显存吞吐 331 GB/s（94% 理论峰值）',
        'FP16 KV cache：2× 显存节省，1.71× 加速'
      ],
      en: [
        '2.0–3.7× speedup over PyTorch baseline',
        '331 GB/s memory throughput (94% of peak) on Nsight',
        'FP16 KV cache: 2× memory saved, up to 1.71× faster'
      ]
    },
    stack: ['CUDA C++', 'PYTORCH', 'NSIGHT']
  },
  {
    fill: 'yellow',
    name: 'LICore',
    kicker: { zh: '持续迭代 · 个人系统项目', en: 'IN PROGRESS · PERSONAL SYSTEMS PROJECT' },
    summary: {
      zh: '基于 Rust 从零实现面向 RISC-V64 的 POSIX 兼容单体内核。35 个 Linux 兼容系统调用，77/80 测试通过。',
      en: 'A POSIX-compatible monolithic kernel for RISC-V64, written from scratch in Rust. 35 Linux-compatible syscalls, 77/80 tests passing.'
    },
    bullets: {
      zh: [
        'Safe / Unsafe 分层架构，核心 #![deny(unsafe_code)]',
        'Buddy 分配器、Sv39 三级页表、VmSpace 抽象',
        'VirtIO-blk 驱动 + Ext4 只读 FS'
      ],
      en: [
        'Layered safe/unsafe arch — core under #![deny(unsafe_code)]',
        'Buddy allocator, Sv39 three-level paging, VmSpace abstraction',
        'VirtIO-blk driver + read-only Ext4 filesystem'
      ]
    },
    stack: ['RUST', 'RISC-V', 'NO_STD']
  },
  {
    fill: 'white',
    name: { zh: '分布式语义检索系统', en: 'DISTRIBUTED SEMANTIC RETRIEVAL' },
    kicker: { zh: '2026 · 云计算课程项目', en: '2026 · CLOUD COMPUTING COURSE' },
    summary: {
      zh: '以 Chord DHT 为底座，基于 sentence-transformers 构建分布式稠密向量索引；Scatter-Gather 协议下 O(log N) 跳完成跨节点 top-k 聚合。',
      en: 'Distributed dense-vector index over a Chord DHT with sentence-transformers; Scatter-Gather protocol delivers cross-node top-k in O(log N) hops.'
    },
    bullets: {
      zh: [
        '完整 RAG 管线：嵌入 → 分片 → 检索 → Prompt → LLM',
        'successor list 容错 + 键值副本策略',
        '82 个单元 / 集成测试'
      ],
      en: [
        'Full RAG pipeline: embed → shard → retrieve → prompt → LLM',
        'Successor-list fault tolerance + key-value replication',
        '82 unit + integration tests'
      ]
    },
    stack: ['PYTHON', 'THRIFT RPC', 'CHORD DHT']
  }
]

const tt = computed(() => i18n[locale.value])
const pick = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val[locale.value] : val)
const arr = (val) => (Array.isArray(val) ? val : val[locale.value])
</script>

<template>
  <article>
    <!-- Locale toggle bar -->
    <div class="locale-bar">
      <LocaleToggle />
    </div>

    <!-- Masthead -->
    <header class="masthead">
      <span class="kicker kicker-uv">{{ tt.affil }}</span>
      <h1 class="display display-hero wordmark">
        {{ tt.name }}
        <span class="serif-pull mark">{{ tt.pull }}</span>
      </h1>
      <p class="eyebrow-thin tag-line">{{ tt.tagline }}</p>
    </header>

    <!-- Now block -->
    <section class="now">
      <span class="kicker">{{ tt.nowKicker }}</span>
      <ul class="now-list">
        <li v-for="(item, i) in tt.now" :key="i">
          <span class="num label-meta">{{ String(i + 1).padStart(2, '0') }}</span>
          <span><strong>{{ item.strong }}</strong> · {{ item.body }}</span>
        </li>
      </ul>
    </section>

    <hr class="rule" />

    <!-- Project tiles -->
    <section>
      <div class="section-head">
        <span class="kicker">{{ tt.workKicker }}</span>
        <h2 class="display display-lg">{{ tt.workTitle }}</h2>
      </div>
      <div class="grid">
        <article
          v-for="p in projects"
          :key="typeof p.name === 'string' ? p.name : p.name.en"
          class="tile"
          :data-fill="p.fill"
        >
          <span class="kicker tile-kicker">{{ pick(p.kicker) }}</span>
          <h3 class="tile-name display">{{ pick(p.name) }}</h3>
          <p class="tile-summary">{{ pick(p.summary) }}</p>
          <ul class="tile-bullets">
            <li v-for="b in arr(p.bullets)" :key="b">{{ b }}</li>
          </ul>
          <div class="tile-stack">
            <span v-for="s in p.stack" :key="s" class="tag tag--ghost">{{ s }}</span>
          </div>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
.locale-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.6rem;
}

.masthead {
  padding: clamp(1.5rem, 2vw, 3rem) 0 clamp(1.5rem, 2vw, 2.5rem);
  border-bottom: 1px solid var(--hairline-dim);
}
.wordmark {
  margin: 0.4rem 0 1rem;
  color: var(--text);
  position: relative;
}
.wordmark .mark {
  display: block;
  margin-top: 0.6rem;
  color: var(--text-meta);
  text-transform: none;
  font-size: clamp(1rem, 0.85rem + 0.7vw, 1.4rem);
  letter-spacing: 0;
}
.tag-line {
  margin: 0.5rem 0 0;
  color: var(--text-meta);
}

.now {
  padding: clamp(2rem, 3vw, 3.5rem) 0 0;
}
.now-list {
  list-style: none;
  padding: 0;
  margin: 1.2rem 0 0;
  display: grid;
  gap: 0.4rem;
}
.now-list li {
  display: grid;
  grid-template-columns: 48px 1fr;
  align-items: baseline;
  padding: 0.9rem 0;
  border-top: 1px dashed var(--hairline-dim);
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--text-muted);
}
.now-list li:last-child {
  border-bottom: 1px dashed var(--hairline-dim);
}
.now-list strong {
  color: var(--mint);
  font-weight: 600;
}
.num {
  color: var(--uv);
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.6rem;
}
.section-head h2 {
  margin: 0;
  letter-spacing: 0.005em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.tile {
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 1.6rem 1.7rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  color: var(--text);
  transition: border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.tile:hover {
  border-color: var(--mint);
}
.tile-name {
  margin: 0;
  font-size: clamp(1.7rem, 1.2rem + 1.2vw, 2.4rem);
  letter-spacing: 0.005em;
  line-height: 0.95;
}
.tile-summary {
  margin: 0;
  line-height: 1.55;
  color: var(--text-muted);
  max-width: 52ch;
}
.tile-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.35rem;
  font-size: 0.92rem;
}
.tile-bullets li {
  padding-left: 1rem;
  position: relative;
  line-height: 1.5;
}
.tile-bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 8px;
  height: 1px;
  background: currentColor;
  opacity: 0.7;
}
.tile-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.tile[data-fill='mint'] {
  background: var(--tile-mint);
  border-color: var(--mint-border);
  color: var(--black);
}
.tile[data-fill='mint'] .kicker { color: var(--uv); }
.tile[data-fill='mint'] .tile-summary { color: rgba(0, 0, 0, 0.78); }
.tile[data-fill='mint'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}

.tile[data-fill='uv'] {
  background: var(--tile-uv);
  border-color: var(--uv-rule);
  color: var(--white);
}
.tile[data-fill='uv'] .kicker { color: var(--mint); }
.tile[data-fill='uv'] .tile-summary { color: rgba(255, 255, 255, 0.86); }

.tile[data-fill='yellow'] {
  background: var(--tile-yellow);
  border-color: #b39800;
  color: var(--black);
}
.tile[data-fill='yellow'] .kicker { color: var(--uv); }
.tile[data-fill='yellow'] .tile-summary { color: rgba(0, 0, 0, 0.78); }
.tile[data-fill='yellow'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}

.tile[data-fill='white'] {
  background: var(--tile-white);
  border-color: #c2c2c2;
  color: var(--black);
}
.tile[data-fill='white'] .kicker { color: var(--uv); }
.tile[data-fill='white'] .tile-summary { color: rgba(0, 0, 0, 0.72); }
.tile[data-fill='white'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}
</style>
