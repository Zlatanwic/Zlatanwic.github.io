import type { Localized } from './projects'

export interface OpenSourceProject {
  name: string
  fill: 'mint' | 'uv' | 'yellow' | 'white'
  role: Localized<string>
  summary: Localized<string>
  tags: string[]
  url?: string
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: 'Kong Debugger',
    fill: 'yellow',
    role: {
      zh: '2025.08 · 个人项目 · 基于 Rust 的内存安全调试器',
      en: '2025.08 · Personal Project · Memory-Safe Debugger in Rust'
    },
    summary: {
      zh: '用 Rust 重写 GDB 核心调试能力，围绕 ptrace、DWARF 调试信息和多进程控制实现断点、单步、变量查看和调用栈回溯。',
      en: 'A Rust debugger that rebuilds core GDB-style workflows around ptrace, DWARF debug info, and multi-process control for breakpoints, stepping, variable inspection, and backtraces.'
    },
    tags: ['RUST', 'PTRACE', 'DWARF', 'GIMLI', 'ADDR2LINE', 'NIX'],
    url: 'https://github.com/Zlatanwic/Kong-Debugger'
  },
  {
    name: 'Rust MCP Server',
    fill: 'mint',
    role: {
      zh: 'Rust · MCP Server · 微信公众号内容读取',
      en: 'Rust · MCP Server · WeChat Article Reader'
    },
    summary: {
      zh: '基于 Rust 开发的 MCP Server，可读取微信公众号内容，已被收录至开源 MCP 合集仓库 awesome-mcp-zh。',
      en: 'A Rust-based MCP server that reads WeChat public-account articles, now listed in the open-source MCP collection awesome-mcp-zh.'
    },
    tags: ['RUST', 'MCP', 'WECHAT', 'AWESOME-MCP-ZH'],
    url: 'https://github.com/Zlatanwic/Wechat-Read-MCP-in-Rust'
  },
  {
    name: 'Fin-RAG',
    fill: 'uv',
    role: {
      zh: '混合检索 · 本地知识库 · 金融问答',
      en: 'Hybrid Retrieval · Local Knowledge Base · Financial QA'
    },
    summary: {
      zh: '基于混合检索与本地知识库构建的金融问答系统，支持面向垂直领域场景的 RAG 问答。',
      en: 'A financial question-answering system built with hybrid retrieval and a local knowledge base, supporting RAG workflows for vertical-domain scenarios.'
    },
    tags: ['RAG', 'HYBRID RETRIEVAL', 'FINANCE', 'LOCAL KB'],
    url: 'https://github.com/Zlatanwic/Fin-RAG'
  },
  {
    name: 'SkVM',
    fill: 'white',
    role: {
      zh: 'Agent Skills 语言虚拟机 · 并行编译与运行时',
      en: 'Language VM for Agent Skills · Parallel Compilation & Runtime'
    },
    summary: {
      zh: '参与 SkVM 中数据并行与指令并行部分的实现，并对 TLP / DLP / ILP 三类并行范式做了更清晰的分类与执行路径整理。',
      en: 'Contributed to SkVM\'s data-parallel and instruction-parallel execution paths, clarifying the TLP / DLP / ILP parallelism taxonomy for portable agent-skill execution.'
    },
    tags: ['AGENT SKILLS', 'LLM RUNTIME', 'TLP', 'DLP', 'ILP'],
    url: 'https://github.com/SJTU-IPADS/SkVM'
  }
]
