<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { Locale } from '../composables/useLocale'
import LocaleToggle from '../components/LocaleToggle.vue'
import GithubGrid from '../components/GithubGrid.vue'

const { locale } = useLocale()

type Localized<T> = Record<Locale, T>

interface Experience {
  time: string
  fill: 'mint' | 'dark'
  role: Localized<string>
  place: Localized<string> | string
  summary: Localized<string>
  bullets: Localized<string[]>
  tags: string[]
}

interface Award {
  year: string
  fill: 'mint' | 'uv' | 'yellow' | 'white'
  title: Localized<string>
  competition: Localized<string> | string
  result: Localized<string>
  details: Localized<string[]>
  tags: string[]
}

const i18n = {
  zh: {
    affil: '同济大学 · 大三 · AI SYSTEMS',
    name: 'LI KUO',
    pull: '“ 在人工智能与计算机系统之间。”',
    tagline: 'AI SYSTEM · MLSYS · LLM INFERENCE · OS · DISTRIBUTED',
    experienceKicker: '经历',
    experienceTitle: '经历日志',
    awardsKicker: '获奖',
    awardsTitle: '竞赛获奖',
    workKicker: '代表项目',
    workTitle: '项目'
  },
  en: {
    affil: 'TONGJI UNIVERSITY · JUNIOR · AI SYSTEMS',
    name: 'LI KUO',
    pull: '“ between AI and SYSTEM.”',
    tagline: 'AI SYSTEM · MLSYS · LLM INFERENCE · OS · DISTRIBUTED',
    experienceKicker: 'EXPERIENCE',
    experienceTitle: 'FIELD.LOG',
    awardsKicker: 'AWARDS',
    awardsTitle: 'COMPETITION.LOG',
    workKicker: 'SELECTED WORK',
    workTitle: 'PROJECTS'
  }
} satisfies Record<Locale, {
  affil: string
  name: string
  pull: string
  tagline: string
  experienceKicker: string
  experienceTitle: string
  awardsKicker: string
  awardsTitle: string
  workKicker: string
  workTitle: string
}>

const experiences: Experience[] = [
  {
    time: '2025.7 - 2026.1',
    fill: 'mint',
    role: {
      zh: '科研助理 · 图像融合与低层视觉',
      en: 'Research Assistant · Image Fusion & Low-Level Vision'
    },
    place: {
      zh: '同济大学 · 图像融合实验室',
      en: 'Tongji University · IF Lab'
    },
    summary: {
      zh: '参与低层视觉与图像融合方向研究，围绕多模态图像增强、融合质量评估和实验复现推进一篇 ACM MM 2026 投稿。',
      en: 'Worked on low-level vision and image fusion research, moving an ACM MM 2026 submission through multimodal enhancement, fusion-quality evaluation, and experiment reproduction.'
    },
    bullets: {
      zh: [
        '整理图像融合 baseline 对比实验、评价指标与实验协议',
        '主导模型训练、可视化对比和消融结果分析',
        '参与论文撰写、图表整理与投稿材料准备'
      ],
      en: [
        'Organized image-fusion baseline comparisons, metrics, and experiment protocols',
        'Led model training, visual comparisons, and ablation-result analysis',
        'Contributed to paper writing, figure polishing, and submission materials'
      ]
    },
    tags: ['ACM MM 2026', 'IMAGE FUSION', 'LOW-LEVEL VISION']
  },
  {
    time: '2026.1 - 2026.3',
    fill: 'dark',
    role: {
      zh: '研究实习 · LLM 推理系统',
      en: 'Research Intern · LLM Inference Systems'
    },
    place: {
      zh: '上海交通大学 · DDST 实验室',
      en: 'SJTU · DDST Lab'
    },
    summary: {
      zh: '面向大模型训推加速，调研并设计基于 RDMA 协议的数据访问路径，关注分布式文件系统在高吞吐训练与推理场景下的瓶颈。',
      en: 'Researched RDMA-based data-access paths for large-model training and inference, focusing on distributed-filesystem bottlenecks under high-throughput workloads.'
    },
    bullets: {
      zh: [
        '分析 LLM 训练/推理中的 I/O pattern 和远端数据访问开销',
        '调研 RDMA、缓存层和分布式文件系统的系统设计取舍',
        '沉淀原型设计思路、模块边界和性能实验计划'
      ],
      en: [
        'Analyzed I/O patterns and remote-data-access overhead in LLM workloads',
        'Studied RDMA, caching layers, and distributed-filesystem design tradeoffs',
        'Shaped prototype notes, module boundaries, and performance experiment plans'
      ]
    },
    tags: ['RDMA', 'DISTRIBUTED FS', 'LLM SYSTEMS']
  }
]

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
        'b=20% 预算下达到 70% 准确率，超过 SnapKV 40pp',
        '32K tokens 上下文仍维持 90% 准确率',
        '系统开销 8.86 ms/步，占解码时间 <4%'
      ],
      en: [
        '70% accuracy at b=20% budget, +40pp over SnapKV',
        '90% accuracy preserved at 32K-token context',
        '8.86 ms/step overhead, <4% of decode time'
      ]
    },
    stack: ['PYTHON', 'PYTORCH', 'QWEN2.5', 'LLAMA-3.2']
  },
  {
    fill: 'uv',
    name: 'FUSED CUDA KERNEL for PAGED KV CACHE',
    kicker: { zh: '2025 · 个人项目', en: '2025 · INDEPENDENT PROJECT' },
    summary: {
      zh: '面向长上下文 LLM decode 的 paged attention kernel：把“两阶段 gather + attention”重构为 fused kernel。',
      en: 'Paged attention kernel for long-context LLM decoding, fusing the two-stage gather + attention path into a single CUDA kernel.'
    },
    bullets: {
      zh: [
        '相较 PyTorch 基线 2.0-2.7x 加速',
        'Nsight 实测显存吞吐 331 GB/s，约 94% 理论峰值',
        'FP16 KV cache：2x 显存节省，最高 1.71x 加速'
      ],
      en: [
        '2.0-2.7x speedup over PyTorch baseline',
        '331 GB/s memory throughput, about 94% of peak on Nsight',
        'FP16 KV cache: 2x memory saved, up to 1.71x faster'
      ]
    },
    stack: ['CUDA C++', 'PYTORCH', 'NSIGHT']
  },
  {
    fill: 'yellow',
    name: 'LICore',
    kicker: { zh: '持续迭代 · 个人系统项目', en: 'IN PROGRESS · PERSONAL SYSTEMS PROJECT' },
    summary: {
      zh: '基于 Rust 从零实现面向 RISC-V64 的 POSIX 兼容单体内核。覆盖内存管理、进程、系统调用与文件系统路径。',
      en: 'A POSIX-compatible monolithic kernel for RISC-V64, written from scratch in Rust, covering memory management, processes, syscalls, and filesystem paths.'
    },
    bullets: {
      zh: [
        'Safe / Unsafe 分层架构，核心模块约束 unsafe 边界',
        'Buddy 分配器、Sv39 三级页表、VmSpace 抽象',
        'VirtIO-blk 驱动 + Ext4 只读文件系统'
      ],
      en: [
        'Layered safe/unsafe architecture with constrained unsafe boundaries',
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
      zh: '以 Chord DHT 为底座，基于 sentence-transformers 构建分布式稠密向量索引；Scatter-Gather 协议完成跨节点 top-k 聚合。',
      en: 'Distributed dense-vector index over a Chord DHT with sentence-transformers; Scatter-Gather protocol delivers cross-node top-k aggregation.'
    },
    bullets: {
      zh: [
        '完整 RAG 管线：嵌入、分片、检索、Prompt、LLM',
        'successor list 容错 + 键值副本策略',
        '82 个单元/集成测试'
      ],
      en: [
        'Full RAG pipeline: embed, shard, retrieve, prompt, LLM',
        'Successor-list fault tolerance + key-value replication',
        '82 unit + integration tests'
      ]
    },
    stack: ['PYTHON', 'THRIFT RPC', 'CHORD DHT']
  }
]

const awards: Award[] = [
  {
    year: '2025.12',
    fill: 'mint',
    title: {
      zh: '国家一等奖 · 队内一顺位',
      en: 'National First Prize · First-Ranked Team Contributor'
    },
    competition: {
      zh: '全球校园人工智能算法精英大赛 · 算法挑战赛道',
      en: 'Global Campus AI Algorithm Elite Competition · Algorithm Challenge Track'
    },
    result: {
      zh: '国家一等奖 / 队内一顺位',
      en: 'National First Prize / first-ranked contributor in team'
    },
    details: {
      zh: [
        '队内一顺位，负责核心算法方案与实验推进',
        '围绕算法挑战任务完成建模、调参、验证和结果整理'
      ],
      en: [
        'Ranked first within the team contribution order and drove the core algorithm plan',
        'Handled modeling, tuning, validation, and result packaging for the challenge task'
      ]
    },
    tags: ['AI ALGORITHM', 'NATIONAL FIRST PRIZE', 'TEAM #1']
  },
  {
    year: '2025.10',
    fill: 'uv',
    title: {
      zh: '国际银奖',
      en: 'International Silver Medal'
    },
    competition: {
      zh: '国际基因工程机器大赛（iGEM）',
      en: 'International Genetically Engineered Machine Competition (iGEM)'
    },
    result: {
      zh: '国际银奖',
      en: 'International Silver Medal'
    },
    details: {
      zh: [
        '参与跨学科项目设计、工程实现与展示材料整理',
        '前端wiki实现与团队协作'
      ],
      en: [
        'Contributed to interdisciplinary project design, engineering implementation, and presentation materials',
        'Implemented the team wiki frontend and coordinated with teammates on delivery'
      ]
    },
    tags: ['IGEM', 'SILVER MEDAL', 'SYNBIO']
  }
]

const tt = computed(() => i18n[locale.value])
const pick = <T,>(val: Localized<T> | T) =>
  val && typeof val === 'object' && !Array.isArray(val) && locale.value in val
    ? (val as Localized<T>)[locale.value]
    : val
const arr = <T,>(val: T[] | Localized<T[]>) => (Array.isArray(val) ? val : val[locale.value])
</script>

<template>
  <article>
    <div class="locale-bar">
      <LocaleToggle />
    </div>

    <header class="masthead">
      <span class="kicker kicker-uv">{{ tt.affil }}</span>
      <h1 class="display display-hero wordmark">
        {{ tt.name }}
        <span class="serif-pull mark">{{ tt.pull }}</span>
      </h1>
      <p class="eyebrow-thin tag-line">{{ tt.tagline }}</p>
    </header>

    <GithubGrid :locale="locale" />

    <hr class="rule" />

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

    <hr class="rule" />

    <section>
      <div class="section-head">
        <span class="kicker kicker-uv">{{ tt.experienceKicker }}</span>
        <h2 class="display display-lg">{{ tt.experienceTitle }}</h2>
      </div>
      <ol class="experience-stream" role="list">
        <li
          v-for="item in experiences"
          :key="item.time"
          class="experience-item"
          :data-fill="item.fill"
        >
          <span class="rail-time label-meta">{{ item.time }}</span>
          <article class="experience-card">
            <div class="experience-head">
              <span class="kicker tile-kicker">{{ pick(item.place) }}</span>
              <span class="label-meta">{{ item.time }}</span>
            </div>
            <h3 class="experience-title">{{ pick(item.role) }}</h3>
            <p class="experience-summary">{{ pick(item.summary) }}</p>
            <ul class="experience-points">
              <li v-for="point in arr(item.bullets)" :key="point">{{ point }}</li>
            </ul>
            <div class="experience-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag tag--ghost">{{ tag }}</span>
            </div>
          </article>
        </li>
      </ol>
    </section>

    <hr class="rule" />

    <section>
      <div class="section-head">
        <span class="kicker">{{ tt.awardsKicker }}</span>
        <h2 class="display display-lg">{{ tt.awardsTitle }}</h2>
      </div>
      <div class="awards-grid">
        <article
          v-for="award in awards"
          :key="award.year + pick(award.title)"
          class="award-card"
          :data-fill="award.fill"
        >
          <div class="award-head">
            <span class="label-meta">{{ award.year }}</span>
            <span class="kicker tile-kicker">{{ pick(award.competition) }}</span>
          </div>
          <h3 class="award-title">{{ pick(award.title) }}</h3>
          <p class="award-result">{{ pick(award.result) }}</p>
          <ul class="award-details">
            <li v-for="detail in arr(award.details)" :key="detail">{{ detail }}</li>
          </ul>
          <div class="award-tags">
            <span v-for="tag in award.tags" :key="tag" class="tag tag--ghost">{{ tag }}</span>
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

.experience-stream {
  list-style: none;
  margin: 0;
  padding: 0 0 0 9rem;
  position: relative;
}
.experience-stream::before {
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
.experience-item {
  position: relative;
  margin-bottom: 0.9rem;
}
.experience-item::before {
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
.rail-time {
  position: absolute;
  left: -9rem;
  top: 1.4rem;
  width: 7.5rem;
  text-align: left;
  letter-spacing: 0.14em;
  color: var(--text-meta);
}
.experience-card {
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 1.35rem 1.55rem 1.45rem;
  background: var(--canvas);
  display: grid;
  gap: 0.75rem;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.experience-card:hover {
  border-color: var(--mint);
}
.experience-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.experience-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.25rem, 1rem + 0.9vw, 1.9rem);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text);
  transition: color var(--dur) var(--ease);
}
.experience-card:hover .experience-title {
  color: var(--hover-blue);
}
.experience-summary {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 68ch;
}
.experience-points {
  list-style: none;
  padding: 0;
  margin: 0.1rem 0 0;
  display: grid;
  gap: 0.35rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}
.experience-points li {
  padding-left: 1rem;
  position: relative;
  line-height: 1.5;
}
.experience-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 8px;
  height: 1px;
  background: currentColor;
  opacity: 0.7;
}
.experience-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.1rem;
}
.experience-item[data-fill='mint'] .experience-card {
  background: var(--tile-mint);
  border-color: var(--mint-border);
  color: var(--black);
}
.experience-item[data-fill='mint'] .kicker,
.experience-item[data-fill='mint'] .label-meta {
  color: var(--uv);
}
.experience-item[data-fill='mint'] .experience-title {
  color: var(--black);
}
.experience-item[data-fill='mint'] .experience-summary,
.experience-item[data-fill='mint'] .experience-points {
  color: rgba(0, 0, 0, 0.78);
}
.experience-item[data-fill='mint'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
.award-card {
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 1.35rem 1.45rem 1.45rem;
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 260px;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.award-card:hover {
  border-color: var(--mint);
}
.award-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}
.award-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.2rem, 1rem + 0.75vw, 1.75rem);
  font-weight: 700;
  line-height: 1.08;
  color: var(--text);
  transition: color var(--dur) var(--ease);
}
.award-card:hover .award-title {
  color: var(--hover-blue);
}
.award-result {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--mint);
}
.award-details {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.35rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}
.award-details li {
  padding-left: 1rem;
  position: relative;
  line-height: 1.5;
}
.award-details li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 8px;
  height: 1px;
  background: currentColor;
  opacity: 0.7;
}
.award-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}
.award-card[data-fill='mint'] {
  background: var(--tile-mint);
  border-color: var(--mint-border);
  color: var(--black);
}
.award-card[data-fill='mint'] .kicker,
.award-card[data-fill='mint'] .label-meta,
.award-card[data-fill='mint'] .award-result {
  color: var(--uv);
}
.award-card[data-fill='mint'] .award-title {
  color: var(--black);
}
.award-card[data-fill='mint'] .award-details {
  color: rgba(0, 0, 0, 0.78);
}
.award-card[data-fill='mint'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}
.award-card[data-fill='uv'] {
  background: var(--tile-uv);
  border-color: var(--uv-rule);
  color: var(--white);
}
.award-card[data-fill='uv'] .kicker,
.award-card[data-fill='uv'] .award-result {
  color: var(--mint);
}
.award-card[data-fill='uv'] .award-details {
  color: rgba(255, 255, 255, 0.86);
}
.award-card[data-fill='yellow'] {
  background: var(--tile-yellow);
  border-color: #b39800;
  color: var(--black);
}
.award-card[data-fill='yellow'] .kicker,
.award-card[data-fill='yellow'] .label-meta,
.award-card[data-fill='yellow'] .award-result {
  color: var(--uv);
}
.award-card[data-fill='yellow'] .award-title {
  color: var(--black);
}
.award-card[data-fill='yellow'] .award-details {
  color: rgba(0, 0, 0, 0.78);
}
.award-card[data-fill='yellow'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}

@media (max-width: 720px) {
  .experience-stream {
    padding-left: 1.5rem;
  }
  .experience-stream::before {
    left: 0.9rem;
  }
  .rail-time {
    position: static;
    width: auto;
    display: block;
    margin-bottom: 0.5rem;
  }
  .experience-item::before {
    left: 0.65rem;
    top: 1.1rem;
  }
}
</style>
