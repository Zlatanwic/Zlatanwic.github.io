/**
 * Reading list — single source of truth.
 *
 * Each entry:
 *   title    string  — full paper title
 *   url      string  — link to paper (arXiv / OpenReview / proceedings); optional
 *   venue    string  — UPPERCASE venue + year, e.g. 'NEURIPS 2024'
 *   category string  — top-level filter bucket, UPPERCASE (drives the chip bar)
 *   area     string  — fine-grained sub-area, UPPERCASE (display only); optional
 *   status   'read' | 'reading' | 'queued'
 *   takeaway string  — one-line "what it solved / what it left behind"; optional
 *
 * Adding a new category: just type a new value in `category`. The chip bar
 * derives the list automatically.
 */
export type PaperStatus = 'read' | 'reading' | 'queued'
export type PaperCategory = 'INFERENCE' | 'DL COMPILER' | 'ARCHITECTURE' | 'ALGORITHM' | 'MISC' | 'AGENTIC AI'
export const categoryOrder: PaperCategory[] = [
  'INFERENCE',
  'DL COMPILER',
  'ARCHITECTURE',
  'ALGORITHM',
  'MISC'
]

export interface Paper {
  title: string
  url?: string
  venue: string
  category: PaperCategory
  area?: string
  status: PaperStatus
  takeaway?: string
  noteSlug?: string
}

export const papers: Paper[] = [
  {
    title: 'SnapKV: LLM Knows What You are Looking for Before Generation',
    url: 'https://arxiv.org/abs/2404.14469',
    venue: 'NEURIPS 2024',
    category: 'INFERENCE',
    area: 'KV CACHE',
    status: 'read',
    noteSlug: 'kv-cache-eviction',
    takeaway:
      '基于 prompt 末段窗口 vote 出关注的 token 位置——简单但偏向 recency；长上下文检索任务上掉得很快。'
  },
  {
    title: 'H2O: Heavy-Hitter Oracle for Efficient Generative Inference of LLMs',
    url: 'https://arxiv.org/abs/2306.14048',
    venue: 'NEURIPS 2023',
    category: 'INFERENCE',
    area: 'KV CACHE',
    status: 'read',
    noteSlug: 'kv-cache-eviction',
    takeaway:
      '“近期 + 累积注意力大者” 的两段式保留，奠定后续 eviction 工作的常见 baseline 形态。'
  },
  {
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    url: 'https://arxiv.org/abs/2309.06180',
    venue: 'SOSP 2023',
    category: 'INFERENCE',
    area: 'LLM SERVING',
    status: 'read',
    takeaway:
      '把虚拟内存的分页观念搬到 KV cache：碎片消失，共享前缀几乎免费。kernel 设计是真正的工程亮点。'
  },
  {
    title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    url: 'https://arxiv.org/abs/2307.08691',
    venue: 'ARXIV 2023',
    category: 'ALGORITHM',
    area: 'ATTENTION KERNEL',
    status: 'read',
    takeaway:
      'work partition、warp 调度比 V1 更激进；理解它之后再看 paged 变体会顺很多。'
  },
  {
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    url: 'https://arxiv.org/abs/2312.00752',
    venue: 'COLM 2024',
    category: 'ARCHITECTURE',
    area: 'STATE SPACE MODEL',
    status: 'reading',
    takeaway:
      'selective scan 把 SSM 拉到能和 Transformer 掰手腕；recall 类任务上仍有结构性短板。'
  },
  {
    title: 'Ring Attention with Blockwise Transformers for Near-Infinite Context',
    url: 'https://arxiv.org/abs/2310.01889',
    venue: 'ICLR 2024',
    category: 'ALGORITHM',
    area: 'DISTRIBUTED',
    status: 'queued',
    takeaway:
      '上下文按节点环切，通信与计算流水线化；超长上下文训练绕不开的一篇。'
  },
  {
    title: 'FLASHINFER: EFFICIENT AND CUSTOMIZABLE ATTENTION ENGINE FOR LLMINFERENCE SERVING',
    url: 'https://arxiv.org/abs/2511.00739',
    venue: 'MLSys 2025',
    category: 'INFERENCE',
    area: 'mlsys fullstack',
    status:'read'
  },
  {
    title: 'Towards Understanding, Analyzing, and Optimizing Agentic AI Execution: A CPU-Centric Perspective',
    url: 'https://arxiv.org/abs/2511.00739',
    venue: 'arxiv 2026',
    category: 'INFERENCE',
    status: 'reading',
    area:'agentic AI',
    noteSlug: 'aaacp'
  },
  {
    title:'KVCOMM: Online Cross-context KV-cache Communication for Efficient LLM-based Multi-agent Systems',
    url: 'https://arxiv.org/abs/2510.12872',
    venue: 'nips 2026',
    category: 'INFERENCE',
    status: 'queued',
    area: 'kv cache management'
  },
  {
    title:'Recursive Multi-Agent Systems',
    url:'https://arxiv.org/abs/2604.25917',
    venue: 'arxiv 2026',
    status: 'queued',
    category:'AGENTIC AI',
    area: 'multi-agnent system'
  },
  {
    title:'Hummingbird+: Advancing FPGA-based LLM Deployment from Research Prototype to Edge Product',
    url:'https://dl.acm.org/doi/10.1145/3748173.3779189',
    venue:'FPGA 2026',
    status:'queued',
    category:'ARCHITECTURE',
    area: 'llm deploy'
  }
]

export const statusLabel: Record<PaperStatus, string> = {
  read: '已读',
  reading: '在读',
  queued: '待读'
}

export const statusOrder: PaperStatus[] = ['read', 'reading', 'queued']
