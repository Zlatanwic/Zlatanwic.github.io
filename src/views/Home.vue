<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { Locale } from '../composables/useLocale'
import { projects } from '../data/projects'
import type { Localized } from '../data/projects'
import { openSourceProjects } from '../data/openSourceProjects'
import { publications } from '../data/publications'
import GithubGrid from '../components/GithubGrid.vue'

const { locale } = useLocale()

interface Experience {
  time: string
  fill: 'mint' | 'dark'
  role: Localized<string>
  place: Localized<string> | string
  summary: Localized<string>
  bullets?: Localized<string[]>
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

interface ResearchInterest {
  title: Localized<string>
  paragraphs: Localized<string[]>
  tags: string[]
}

const i18n = {
  zh: {
    affil: '同济大学 · 大三 · AI SYSTEMS',
    name: 'LI KUO',
    pull: '“ 在人工智能与计算机系统之间。”',
    tagline: 'MLSYS FULLSTACK · LLM INFERENCE · OS · DISTRIBUTED',
    experienceKicker: 'experience',
    experienceTitle: 'experience.log',
    awardsKicker: '获奖',
    awardsTitle: '竞赛获奖',
    openSourceKicker: '开源',
    openSourceTitle: '参与的有趣开源项目',
    researchKicker: 'RESEARCH',
    researchTitle: '研究兴趣',
    researchIntro:
      '我的研究兴趣主要集中在 Machine Learning Systems（MLSys）方向，尤其关注如何通过系统、编译器、运行时和硬件协同优化，使深度学习模型能够在真实部署环境中实现更高效、更鲁棒、更可扩展的运行。',
    researchToggleOpen: '展开全文',
    researchToggleClose: '收起',
    publicationsKicker: '发表',
    publicationsTitle: '论文',
    workKicker: '代表项目',
    workTitle: '项目'
  },
  en: {
    affil: 'TONGJI UNIVERSITY · JUNIOR · AI SYSTEMS',
    name: 'LI KUO',
    pull: '“ between AI and SYSTEM.”',
    tagline: 'MLSYS FULLSTACK · LLM INFERENCE · OS · DISTRIBUTED',
    experienceKicker: 'EXPERIENCE',
    experienceTitle: 'FIELD.LOG',
    awardsKicker: 'AWARDS',
    awardsTitle: 'COMPETITION.LOG',
    openSourceKicker: 'OPEN SOURCE',
    openSourceTitle: 'INTERESTING PROJECTS',
    researchKicker: 'RESEARCH',
    researchTitle: 'RESEARCH INTERESTS',
    researchIntro:
      'My research interests mainly lie in Machine Learning Systems (MLSys), with a particular focus on improving the efficiency, robustness, and scalability of deep learning models in real-world deployment environments through the co-optimization of systems, compilers, runtimes, and hardware.',
    researchToggleOpen: 'EXPAND',
    researchToggleClose: 'COLLAPSE',
    publicationsKicker: 'PUBLICATIONS',
    publicationsTitle: 'PAPERS',
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
  openSourceKicker: string
  openSourceTitle: string
  researchKicker: string
  researchTitle: string
  researchIntro: string
  researchToggleOpen: string
  researchToggleClose: string
  publicationsKicker: string
  publicationsTitle: string
  workKicker: string
  workTitle: string
}>

const researchExpanded = ref(false)

const researchOverview: Localized<string>[] = [
  {
    zh: 'MLSys 本身强调机器学习与系统设计的交叉，涵盖分布式计算、硬件加速、能效优化以及面向实际机器学习工作流的系统设计原则。',
    en: 'MLSys emphasizes the intersection of machine learning and system design, covering topics such as distributed computing, hardware acceleration, energy efficiency optimization, and system design principles for practical machine learning workflows.'
  },
  {
    zh: '这一方向也与我希望长期深耕的研究方向高度一致。',
    en: 'This direction is highly aligned with the area in which I hope to conduct long-term research.'
  }
]

const researchInterests: ResearchInterest[] = [
  {
    title: {
      zh: '面向不同部署场景的大模型推理优化',
      en: 'Large language model inference optimization for different deployment scenarios'
    },
    paragraphs: {
      zh: [
        '我对 LLM inference serving 中的内存管理、计算优化和长上下文效率问题非常感兴趣。当前大模型推理系统面临显著的 KV cache 内存瓶颈，而高吞吐、低延迟、低成本的推理服务已经成为实际部署中的关键问题。例如，vLLM 等系统通过高效的内存管理和服务引擎设计来提升 LLM serving 的吞吐与内存效率。',
        '在这一方向上，我希望进一步研究资源受限场景下的大模型部署优化，包括端侧设备、RISC-V 平台以及低显存 GPU 环境中的量化、剪枝、KV cache 压缩、卸载与调度策略。',
        '此外，我也在探索更细粒度、更具语义感知能力的推理优化方法。例如，在 Agent / RAG 等长上下文与多轮交互场景中，模型的注意力与知识使用往往具有明显的语义结构，因此可以设计语义感知的 KV retention / eviction 策略，以在有限缓存预算下保留对最终回答真正关键的信息。',
        '这一方向也与我目前关于 KV cache eviction 的研究工作高度契合，后续我希望将其进一步系统化，面向更复杂的长上下文推理、RAG 检索增强生成以及 Agent 工作流进行扩展。',
        '同时，随着 Mamba、Hybrid Attention-SSM 等新型序列建模架构的发展，推理系统中的缓存形态也不再局限于传统 Transformer 的 KV cache。Mamba 提出了 selective state space model，并强调线性序列长度扩展和硬件感知实现，这使得 State Cache / Hybrid Cache 的管理成为一个值得深入研究的新问题。因此，我也希望研究面向 Mamba / Hybrid 模型的状态缓存压缩、调度和跨硬件部署优化。'
      ],
      en: [
        'I am highly interested in memory management, computation optimization, and long-context efficiency in LLM inference serving. Current large language model inference systems face significant KV cache memory bottlenecks, while high-throughput, low-latency, and cost-efficient inference serving has become a key challenge in real-world deployment. For example, systems such as vLLM improve the throughput and memory efficiency of LLM serving through efficient memory management and serving engine design.',
        'Along this direction, I hope to further study deployment optimization for large language models under resource-constrained scenarios, including quantization, pruning, KV cache compression, offloading, and scheduling strategies on edge devices, RISC-V platforms, and GPUs with limited memory.',
        'In addition, I am also exploring more fine-grained and semantically aware inference optimization methods. For example, in long-context and multi-turn interaction scenarios such as Agent and RAG applications, model attention and knowledge utilization often exhibit clear semantic structures. Therefore, it is possible to design semantically aware KV retention and eviction strategies to preserve information that is truly critical to the final response under a limited cache budget.',
        'This direction is closely related to my current research on KV cache eviction. In the future, I hope to further systematize this work and extend it to more complex long-context inference, retrieval-augmented generation, and Agent workflows.',
        'Meanwhile, with the development of new sequence modeling architectures such as Mamba and Hybrid Attention-SSM models, the form of cache in inference systems is no longer limited to the traditional KV cache used in Transformers. Mamba introduces selective state space models and emphasizes linear scaling with sequence length and hardware-aware implementation, making the management of State Cache and Hybrid Cache a promising research problem. Therefore, I also hope to investigate state cache compression, scheduling, and cross-hardware deployment optimization for Mamba and hybrid models.'
      ]
    },
    tags: ['LLM SERVING', 'KV CACHE', 'LONG CONTEXT', 'EDGE AI']
  },
  {
    title: {
      zh: '深度学习编译器与软硬件协同优化',
      en: 'Deep learning compilers and software-hardware co-optimization'
    },
    paragraphs: {
      zh: [
        '我对 DL compiler、kernel fusion、算子生成和异构硬件适配有浓厚兴趣。我的长期目标是探索如何通过编译优化、运行时调度和硬件特性感知，使不同类型的深度学习模型能够高效、稳定地运行在 GPU、端侧 NPU、RISC-V 加速器等多样化硬件平台上。',
        '在工程经验方面，我已经具备一定的 CUDA 和 Triton 编程基础，曾尝试实现融合算子优化，并关注 GPU kernel 中的访存合并、线程组织、算子融合和半精度计算等性能问题。',
        'Triton 作为面向深度学习 workload 的 GPU 编程与编译工具，为开发高性能自定义算子提供了更高层次的抽象，这也使我对“编译器如何连接模型表达与底层硬件性能”这一问题产生了更强兴趣。',
        '后续我希望继续深入学习 TVM、Triton、MLIR、XLA 等系统，探索从图级优化、算子级优化到硬件后端代码生成的完整链路。'
      ],
      en: [
        'I am also strongly interested in deep learning compilers, kernel fusion, operator generation, and heterogeneous hardware adaptation. My long-term goal is to explore how different types of deep learning models can run efficiently and reliably on diverse hardware platforms, such as GPUs, edge NPUs, and RISC-V accelerators, through compiler optimization, runtime scheduling, and hardware-aware design.',
        'In terms of engineering experience, I have developed a foundation in CUDA and Triton programming. I have attempted to implement fused operator optimizations and have paid close attention to performance issues in GPU kernels, including memory coalescing, thread organization, operator fusion, and half-precision computation.',
        'As a GPU programming and compilation tool designed for deep learning workloads, Triton provides a higher-level abstraction for developing high-performance custom operators. This has further strengthened my interest in the question of how compilers bridge model representation and low-level hardware performance.',
        'In the future, I hope to continue studying systems such as TVM, Triton, MLIR, and XLA, and explore the full optimization pipeline from graph-level optimization and operator-level optimization to hardware backend code generation.'
      ]
    },
    tags: ['CUDA', 'TRITON', 'TVM', 'MLIR', 'XLA']
  },
  {
    title: {
      zh: '面向深度学习的分布式训练与存算系统',
      en: 'Distributed training and storage-computation systems for deep learning'
    },
    paragraphs: {
      zh: [
        '受 Hetu 等分布式深度学习系统的启发，我对大规模模型训练和推理中的分布式系统问题也非常感兴趣。随着模型规模和数据规模持续增长，单机优化已经难以满足实际需求，如何在多 GPU、多节点甚至异构集群中高效完成计算、通信、存储和调度，成为深度学习系统中的核心问题。',
        '在这一方向上，我希望重点研究分布式并行策略、通信优化、图计算系统与深度学习框架之间的结合，包括数据并行、模型并行、流水线并行、张量并行、参数/状态分片、通信压缩以及存算协同调度等问题。',
        '我目前正在系统阅读相关论文和开源项目，希望进一步理解深度学习 workload 的计算图结构、运行时调度机制以及底层通信与存储瓶颈，并在此基础上探索更高效的训练与推理系统设计。'
      ],
      en: [
        'Inspired by distributed deep learning systems such as Hetu, I am also interested in distributed systems problems in large-scale model training and inference. As model and data scales continue to grow, single-machine optimization alone is no longer sufficient for real-world demands.',
        'How to efficiently coordinate computation, communication, storage, and scheduling across multi-GPU, multi-node, and even heterogeneous clusters has become a core problem in deep learning systems.',
        'Along this direction, I hope to focus on distributed parallelism strategies, communication optimization, and the integration of graph computing systems with deep learning frameworks. Relevant topics include data parallelism, model parallelism, pipeline parallelism, tensor parallelism, parameter and state sharding, communication compression, and storage-computation co-scheduling.',
        'I am currently systematically reading related papers and open-source projects, hoping to better understand the computation graph structures, runtime scheduling mechanisms, and underlying communication and storage bottlenecks of deep learning workloads. Based on this understanding, I hope to explore more efficient training and inference system designs.'
      ]
    },
    tags: ['DISTRIBUTED TRAINING', 'PARALLELISM', 'RUNTIME', 'STORAGE']
  },
  {
    title: {
      zh: '面向前沿 Agent 系统的基础设施',
      en: 'Infrastructure for frontier Agent systems'
    },
    paragraphs: {
      zh: [
        '我也关注面向 Agentic AI 的系统基础设施建设。随着大模型逐渐从单轮问答走向工具调用、多 Agent 协作、长期记忆、代码执行和复杂任务规划，系统层面需要提供更可靠的 sandbox、状态管理、权限隔离、工具调度、任务恢复和资源控制机制。',
        '相比单纯提升模型能力，我认为构建安全、高效、可观测、可扩展的 Agent runtime 同样是未来 AI Systems 中非常重要的方向。',
        '因此，我希望进一步研究 Agent sandbox、工具执行环境、长程任务调度、RAG/Memory 系统、上下文压缩与恢复机制，以及多 Agent 协作中的通信与资源管理问题。',
        '长期来看，我希望能够从模型推理优化、编译器与运行时系统、分布式存算系统以及 Agent 基础设施等多个层面，构建面向真实应用场景的高效、鲁棒、可扩展的深度学习系统。'
      ],
      en: [
        'I am also interested in infrastructure for Agentic AI systems. As large language models gradually evolve from single-turn question answering toward tool use, multi-agent collaboration, long-term memory, code execution, and complex task planning, system-level infrastructure needs to provide more reliable sandboxing, state management, permission isolation, tool scheduling, task recovery, and resource control.',
        'Compared with simply improving model capability, I believe that building safe, efficient, observable, and scalable Agent runtimes will also become an important direction in future AI Systems research.',
        'Therefore, I hope to further study Agent sandboxes, tool execution environments, long-horizon task scheduling, RAG and memory systems, context compression and recovery mechanisms, as well as communication and resource management in multi-agent collaboration.',
        'In the long term, I hope to build efficient, robust, and scalable deep learning systems for real-world applications from multiple levels, including model inference optimization, compilers and runtime systems, distributed storage-computation systems, and Agent infrastructure.'
      ]
    },
    tags: ['AGENT RUNTIME', 'SANDBOX', 'RAG', 'MEMORY SYSTEMS']
  }
]

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
  },
  //{
   // time: '2026.4 - now',
 //   fill: 'mint',
 //   role: {
 //     zh: '研究实习 · LLM 推理系统',
  //    en: 'Research Intern · LLM Inference Systems'
 //   },
 //   place: {
 //     zh: '南京大学',
 //     en: 'NJU'
  //  },
  //  summary: {
  //    zh: '不同场景在kv cache管理。',
  //    en: 'KV cache management in different situation.'
  //  },
    // bullets: {
    //   zh: [
    //     '分析 LLM 训练/推理中的 I/O pattern 和远端数据访问开销',
    //     '调研 RDMA、缓存层和分布式文件系统的系统设计取舍',
    //     '沉淀原型设计思路、模块边界和性能实验计划'
    //   ],
    //   en: [
    //     'Analyzed I/O patterns and remote-data-access overhead in LLM workloads',
    //     'Studied RDMA, caching layers, and distributed-filesystem design tradeoffs',
    //     'Shaped prototype notes, module boundaries, and performance experiment plans'
    //   ]
    // },
 //   tags: ['KV cache', 'agentic AI', 'LLM SYSTEMS']
 // }
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
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')
</script>

<template>
  <article>
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

    <section class="research-section">
      <div class="section-head research-head">
        <div>
          <span class="kicker kicker-uv">{{ tt.researchKicker }}</span>
          <h2 class="display display-lg">{{ tt.researchTitle }}</h2>
        </div>
        <button
          class="research-toggle"
          type="button"
          :aria-expanded="researchExpanded"
          aria-controls="research-panel"
          @click="researchExpanded = !researchExpanded"
        >
          <span>{{ researchExpanded ? tt.researchToggleClose : tt.researchToggleOpen }}</span>
          <span class="toggle-mark" aria-hidden="true"></span>
        </button>
      </div>

      <article class="research-card" :class="{ 'is-open': researchExpanded }">
        <p class="research-lede">{{ tt.researchIntro }}</p>
        <div class="research-overview">
          <p v-for="paragraph in researchOverview" :key="String(pick(paragraph))">{{ pick(paragraph) }}</p>
        </div>
        <div class="research-tags">
          <span
            v-for="interest in researchInterests"
            :key="String(pick(interest.title))"
            class="tag tag--ghost"
          >
            {{ interest.tags[0] }}
          </span>
        </div>

        <div
          id="research-panel"
          class="research-panel"
          :aria-hidden="!researchExpanded"
        >
          <div class="research-panel-inner">
            <article
              v-for="(interest, index) in researchInterests"
              :key="String(pick(interest.title))"
              class="research-topic"
            >
              <span class="research-index label-meta">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="research-topic-copy">
                <h3>{{ pick(interest.title) }}</h3>
                <p v-for="paragraph in arr(interest.paragraphs)" :key="paragraph">{{ paragraph }}</p>
                <div class="research-topic-tags">
                  <span v-for="tag in interest.tags" :key="tag" class="tag tag--ghost">{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </article>
    </section>

    <hr class="rule" />

    <section>
      <div class="section-head">
        <span class="kicker kicker-uv">{{ tt.publicationsKicker }}</span>
        <h2 class="display display-lg">{{ tt.publicationsTitle }}</h2>
      </div>
      <div class="publication-list">
        <article
          v-for="paper in publications"
          :key="paper.title"
          class="publication-card"
        >
          <div class="publication-copy">
            <div class="publication-meta">
              <span class="kicker tile-kicker">{{ pick(paper.venue) }}</span>
              <span class="label-meta">{{ pick(paper.status) }}</span>
            </div>
            <h3 class="publication-title">
              <a
                v-if="paper.url"
                :href="paper.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ paper.title }}
              </a>
              <template v-else>{{ paper.title }}</template>
            </h3>
            <p class="publication-authors">{{ pick(paper.authors) }}</p>
            <p class="publication-summary">{{ pick(paper.summary) }}</p>
            <div class="publication-tags">
              <span v-for="tag in paper.tags" :key="tag" class="tag tag--ghost">{{ tag }}</span>
            </div>
          </div>
          <figure class="publication-figure">
            <object
              v-if="isPdf(paper.architectureImage)"
              class="publication-pdf"
              :data="`${paper.architectureImage}#toolbar=0&navpanes=0&scrollbar=0`"
              type="application/pdf"
              :aria-label="String(pick(paper.architectureAlt))"
            >
              <a
                class="publication-pdf-fallback"
                :href="paper.architectureImage"
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN ARCHITECTURE PDF
              </a>
            </object>
            <img
              v-else
              :src="paper.architectureImage"
              :alt="String(pick(paper.architectureAlt))"
              loading="lazy"
            >
          </figure>
        </article>
      </div>
    </section>

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
          <h3 class="tile-name display">
            <a
              v-if="p.url"
              :href="p.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ pick(p.name) }}
            </a>
            <template v-else>{{ pick(p.name) }}</template>
          </h3>
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
            <ul v-if="item.bullets" class="experience-points">
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

    <hr class="rule" />

    <section>
      <div class="section-head">
        <span class="kicker kicker-uv">{{ tt.openSourceKicker }}</span>
        <h2 class="display display-lg">{{ tt.openSourceTitle }}</h2>
      </div>
      <div class="oss-grid">
        <article
          v-for="project in openSourceProjects"
          :key="project.name"
          class="oss-card"
          :data-fill="project.fill"
        >
          <div class="oss-head">
            <span class="kicker tile-kicker">{{ pick(project.role) }}</span>
            <a
              v-if="project.url"
              class="oss-link label-meta"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB
            </a>
          </div>
          <h3 class="oss-title">
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ project.name }}
            </a>
            <template v-else>{{ project.name }}</template>
          </h3>
          <p class="oss-summary">{{ pick(project.summary) }}</p>
          <div class="oss-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag tag--ghost">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
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

.research-head {
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}
.research-head > div {
  display: grid;
  gap: 0.6rem;
}
.research-toggle {
  appearance: none;
  border: 1px solid var(--mint);
  border-radius: 999px;
  background: transparent;
  color: var(--mint);
  min-height: 2.65rem;
  padding: 0.7rem 1rem 0.7rem 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--dur) var(--ease),
    color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.research-toggle:hover,
.research-toggle:focus-visible {
  background: var(--mint);
  color: var(--black);
  outline: none;
}
.toggle-mark {
  width: 0.7rem;
  height: 0.7rem;
  position: relative;
  flex: 0 0 auto;
}
.toggle-mark::before,
.toggle-mark::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: translateY(-50%);
  transition: transform var(--dur) var(--ease);
}
.toggle-mark::after {
  transform: translateY(-50%) rotate(90deg);
}
.research-toggle[aria-expanded='true'] .toggle-mark::after {
  transform: translateY(-50%) rotate(0deg);
}
.research-card {
  border: 1px solid var(--hairline);
  border-radius: 24px;
  background: var(--canvas);
  padding: clamp(1.1rem, 2vw, 1.6rem);
  transition: border-color var(--dur) var(--ease);
}
.research-card:hover,
.research-card.is-open {
  border-color: var(--mint);
}
.research-lede {
  margin: 0;
  max-width: 82ch;
  color: var(--text);
  font-size: clamp(1.15rem, 1rem + 0.7vw, 1.55rem);
  line-height: 1.45;
  font-weight: 650;
}
.research-overview {
  display: grid;
  gap: 0.65rem;
  max-width: 84ch;
  margin-top: 1rem;
}
.research-overview p,
.research-topic p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.68;
}
.research-tags,
.research-topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.research-tags {
  margin-top: 1.15rem;
}
.research-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 520ms var(--ease),
    opacity 260ms var(--ease), margin-top 520ms var(--ease);
}
.research-card.is-open .research-panel {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 1.35rem;
}
.research-panel-inner {
  overflow: hidden;
  display: grid;
  gap: 1rem;
}
.research-topic {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--hairline-dim);
}
.research-index {
  color: var(--mint);
  padding-top: 0.25rem;
}
.research-topic-copy {
  display: grid;
  gap: 0.75rem;
}
.research-topic h3 {
  margin: 0;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: clamp(1.18rem, 1rem + 0.8vw, 1.75rem);
  line-height: 1.12;
}
.research-topic-tags {
  margin-top: 0.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.publication-list {
  display: grid;
  gap: 1rem;
}
.publication-card {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
  gap: clamp(1rem, 2vw, 1.6rem);
  align-items: stretch;
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: clamp(1rem, 2vw, 1.4rem);
  background: var(--canvas);
  transition: border-color var(--dur) var(--ease);
}
.publication-card:hover {
  border-color: var(--mint);
}
.publication-copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem;
  min-width: 0;
}
.publication-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.publication-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.45rem, 1.1rem + 1.2vw, 2.2rem);
  font-weight: 800;
  line-height: 1.05;
  color: var(--text);
  transition: color var(--dur) var(--ease);
}
.publication-title a {
  color: inherit;
}
.publication-card:hover .publication-title {
  color: var(--hover-blue);
}
.publication-authors {
  margin: 0;
  color: var(--mint);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.publication-summary {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 62ch;
}
.publication-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}
.publication-figure {
  margin: 0;
  min-width: 0;
  border: 1px solid var(--hairline-dim);
  border-radius: 18px;
  background: var(--tile-white);
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.publication-figure img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.publication-pdf {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: var(--tile-white);
}
.publication-pdf-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--uv);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
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
.tile-name a {
  color: inherit;
}
.tile:hover .tile-name a {
  color: var(--hover-blue);
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

.oss-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}
.oss-card {
  border: 1px solid var(--hairline);
  border-radius: 24px;
  padding: 1.45rem 1.55rem 1.5rem;
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 280px;
  transition: border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.oss-card:hover {
  border-color: var(--mint);
}
.oss-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}
.oss-link {
  color: var(--text-meta);
}
.oss-link:hover {
  color: var(--hover-blue);
}
.oss-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.35rem, 1rem + 1vw, 2rem);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text);
  transition: color var(--dur) var(--ease);
}
.oss-title a {
  color: inherit;
}
.oss-card:hover .oss-title {
  color: var(--hover-blue);
}
.oss-summary {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 62ch;
}
.oss-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}
.oss-card[data-fill='uv'] {
  background: var(--tile-uv);
  border-color: var(--uv-rule);
  color: var(--white);
}
.oss-card[data-fill='uv'] .kicker {
  color: var(--mint);
}
.oss-card[data-fill='uv'] .oss-summary {
  color: rgba(255, 255, 255, 0.86);
}
.oss-card[data-fill='yellow'] {
  background: var(--tile-yellow);
  border-color: #b39800;
  color: var(--black);
}
.oss-card[data-fill='yellow'] .kicker,
.oss-card[data-fill='yellow'] .oss-link {
  color: var(--uv);
}
.oss-card[data-fill='yellow'] .oss-title {
  color: var(--black);
}
.oss-card[data-fill='yellow'] .oss-summary {
  color: rgba(0, 0, 0, 0.78);
}
.oss-card[data-fill='yellow'] .tag--ghost {
  border-color: var(--black);
  color: var(--black);
}

@media (max-width: 720px) {
  .research-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .research-toggle {
    width: 100%;
    justify-content: space-between;
  }
  .research-topic {
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }
  .research-index {
    padding-top: 0;
  }
  .publication-card {
    grid-template-columns: 1fr;
  }
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
