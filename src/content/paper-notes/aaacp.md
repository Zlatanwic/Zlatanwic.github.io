---
title: "Towards Understanding, Analyzing, and Optimizing Agentic AI Execution: A CPU-Centric Perspective"
date: "2026-04-26"
category: "RESEARCH NOTE"
status: "planned"
deck: ""
fill: "mint"
---
## intro
独立的llm有context-agnosticism, 幻觉以及缺少实时信息等等问题，所以有了agentic ai范式，可以调用外部工具
一些有名的agentic ai 框架比如：
- ReAct
- AutoGPT
- BabyAGI
展示出了巨大的成功。
论文指出虽然很多人还gpu侧做优化，但是agentic workload的e2e的latency很多还是出现在cpu的tool execution上。
+ 首先，论文分别对`compile-time`和`run-time`的系统延迟做了分类
+ 第二，提出了调度优化

## compile-time 分类
### 三个对agentic ai的正交分类
#### Orchestrator-based分类
+ llm-orchestrator: 用llm来控制端到端的执行流，决定何时引入tool以及何时输出，llm既负责reasoning也负责control flow。比如：ReAct
AutoGPT
BabyAGI
AgentGPT
CAMEL
MetaGPT
+ host-orchestrator: 流程是python定义好的，llm只是一个被调用的模块。比如：LangChain
Semantic Kernel
Haystack
LlamaIndex
#### 按执行路径是否固定分类
+ static-path: 执行路径提前写好
+ dynamic-path: 根据运行期间的中间结果、环境反馈，通过llm判断来动态生成
#### 按是否反复交互来分类
+ single-step: 在一次流程中完成，不需要和环境反馈 e.g:CoT prompting systems, Zero-shot tool use, Single-turn QA agents, RAG
+ multi-step: agent 会多次与工具、环境或外部系统交互，并根据每次返回结果调整下一步行为。e.g:WebArena[85], Balrog [53], AgentBench [42]

### 代表性的workload
| Workload            | Orchestrator | Path    | Flow        |
| ------------------- | ------------ | ------- | ----------- |
| Toolformer          | LLM          | Dynamic | Single-step |
| SWE-Agent           | LLM          | Static  | Multi-step  |
| RAG / Haystack      | Host         | Static  | Single-step |
| ChemCrow            | LLM          | Dynamic | Multi-step  |
| Web-Augmented Agent | Host         | Static  | Single-step |
## profiling
