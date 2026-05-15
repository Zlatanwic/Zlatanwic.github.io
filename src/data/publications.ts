import type { Locale } from '../composables/useLocale'
import type { Localized } from './projects'

export interface Publication {
  title: string
  venue: Localized<string> | string
  status: Localized<string> | string
  authors: Localized<string> | string
  summary: Localized<string>
  architectureImage: string
  architectureAlt: Localized<string>
  tags: string[]
  url?: string
}

export const publications: Publication[] = [
  {
    title: 'SieveKV: A Semantics-Aware KV Cache Eviction Strategy for Long-Context Inference',
    venue: {
      zh: 'ICIC 2026',
      en: 'ICIC 2026'
    },
    status: {
      zh: 'Oral 录用',
      en: 'Accepted as Oral'
    },
    authors: {
      zh: 'Li Kuo',
      en: 'Li Kuo'
    },
    summary: {
      zh: '面向长上下文推理的语义感知 KV Cache 驱逐策略，融合注意力质量、头熵、信息密度、查询相关度与事实似然五维轻量信号。',
      en: 'Semantic-aware KV cache eviction for long-context inference, combining attention quality, head entropy, information density, query relevance, and factual likelihood.'
    },
    architectureImage: '/publications/SieveKV.pdf',
    architectureAlt: {
      zh: 'SIEVEKV 架构图：从长上下文输入提取五维语义信号，并生成 KV cache 保留决策。',
      en: 'SIEVEKV architecture: five semantic signals are extracted from long-context input to produce KV cache retention decisions.'
    },
    tags: ['ORAL', 'KV CACHE', 'LLM INFERENCE', 'LONG CONTEXT']
  }
]

export type PublicationLocale = Locale
