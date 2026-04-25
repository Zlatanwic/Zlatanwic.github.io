import type { Locale } from '../composables/useLocale'

export type Localized<T> = Record<Locale, T>

export interface Project {
  fill: 'mint' | 'uv' | 'yellow' | 'white'
  name: Localized<string> | string
  kicker: Localized<string>
  summary: Localized<string>
  bullets: Localized<string[]>
  stack: string[]
}

export const projects: Project[] = [
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
