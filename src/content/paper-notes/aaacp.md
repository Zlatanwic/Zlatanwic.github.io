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
### System and Software Setup
+ Sys1 :高性能cpu+低性能gpu
+ Sys2 :高性能cpu+高性能gpu

如果一个workload从Sys1改成Sys2之后速率有明显提升说明是gpu-bound，反之是cpu-bound
### end2end latency分析
测试了5个有代表性的workload
+ RAG / Haystack：检索是主瓶颈,所以bottleneck在cpu
+ Toolformer：LLM inference 仍然是主瓶颈
+ Web-Augmented Agent：Web I/O + LexRank 摘要很重,优化网络比优化llm inference更加重要
+ ChemCrow：heavy molecule 被 RDKit 主导
+ SWE-Agent：GPU 越强，CPU 代码执行越显眼，当gpu性能更强是会把latency占比推向cpu

`2个key takeway`:
+ CPU 工具执行可以占 E2E latency 的很大部分
+ 高性能 GPU 会把瓶颈推向 CPU
### Throughput Analysis
对于gpu-only的llm inference,只测吞吐量：

$$
\mathrm{throughput} = \frac{BS \times (T_{in} + T_{out})}{t_{sec}}
$$
+ BS: batch size
+ Tin: input tokens
+ Tout: output tokens
+ tsec: 生成这些 token 的总时间

实验发现，随着 batch size 增大，GPU throughput 稳步上升，说明 GPU 能有效利用 batch 并行。

但到大 batch 后，吞吐增长变慢甚至饱和。

原因是：

batch size 越大
 → KV cache footprint 越大
 → GPU memory capacity 和 bandwidth 压力越大
 → throughput 开始饱和

论文特别指出，PagedAttention 可以减少 memory fragmentation、提升 serving 效率，但不能消除 GPU 显存容量和带宽的根本限制。

这部分其实是在说：

即使是 GPU-only LLM serving，
batch scaling 也不是无限的；
最后仍会遇到显存和带宽瓶颈。