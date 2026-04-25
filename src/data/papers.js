/**
 * Reading list — single source of truth.
 *
 * Each entry:
 *   title    string  — full paper title
 *   url      string  — link to paper (arXiv / OpenReview / proceedings); optional
 *   venue    string  — UPPERCASE venue + year, e.g. 'NEURIPS 2024'
 *   category string  — top-level filter bucket, UPPERCASE (drives the chip bar)
 *   area     string  — fine-grained sub-area, UPPERCASE (display only)
 *   status   'read' | 'reading' | 'queued'
 *   takeaway string  — one-line "what it solved / what it left behind"
 *
 * Adding a new category: just type a new value in `category`. The chip bar
 * derives the list automatically.
 */
export const papers = [
  {
    title: 'SnapKV: LLM Knows What You are Looking for Before Generation',
    url: 'https://arxiv.org/abs/2404.14469',
    venue: 'NEURIPS 2024',
    category: 'INFERENCE',
    area: 'KV CACHE',
    status: 'read',
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
    takeaway:
      '“近期 + 累积注意力大者” 的两段式保留，奠定后续 eviction 工作的常见 baseline 形态。'
  },
  {
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    url: 'https://arxiv.org/abs/2309.06180',
    venue: 'SOSP 2023',
    category: 'SYSTEMS',
    area: 'LLM SERVING',
    status: 'read',
    takeaway:
      '把虚拟内存的分页观念搬到 KV cache：碎片消失，共享前缀几乎免费。kernel 设计是真正的工程亮点。'
  },
  {
    title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    url: 'https://arxiv.org/abs/2307.08691',
    venue: 'ARXIV 2023',
    category: 'KERNEL',
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
    category: 'SYSTEMS',
    area: 'DISTRIBUTED',
    status: 'queued',
    takeaway:
      '上下文按节点环切，通信与计算流水线化；超长上下文训练绕不开的一篇。'
  }
]

export const statusLabel = {
  read: '已读',
  reading: '在读',
  queued: '待读'
}

export const statusOrder = ['read', 'reading', 'queued']
