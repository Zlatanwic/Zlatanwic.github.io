---
title: 项目
description: 系统与推理方向的工程实践，涵盖 LLM 推理优化、操作系统内核与分布式系统。
---

# 项目

AI4sys,sys4AI，拥抱ai，持续探索

---

## SieveKV：面向长上下文推理的语义感知 KV Cache 驱逐策略

**2026.03 · 独立一作投稿 ICIC 2026**  
`Python` `PyTorch` `Transformers` `Qwen2.5-3B` `Llama-3.2-3B`

针对 KV cache 预算受限下长上下文检索退化问题，提出 SieveKV——融合**注意力质量、头熵、信息密度、查询相关度与事实似然**五维轻量信号，配合 role-aware pinning 与块级连续保留机制。

**核心结果：**

- 预算 b=20% 时达 **70% 准确率**，超 SnapKV 40pp，超越全 KV 上界 58%
- 10% 极低预算下达 **80%**，所有 baseline 均低于 40%
- 上下文扩展至 32K tokens 时仍维持 **90% 准确率**，验证语义信号在极端长度下的鲁棒性
- 多针联合检索场景下达 **92.5%**，超越全 KV 上界（80%）
- 系统开销仅 **8.86 ms/步**，占解码时间 <4%

搭建 1900+ 组自动化评测流程，涵盖 RULER NIAH、预算敏感度、深度分析、跨架构验证等维度；在 Qwen2.5-3B 与 Llama-3.2-3B 双架构上验证**跨模型迁移无需重调**。

---

## 面向大模型解码的 Paged KV Cache CUDA Kernel 优化

**2025 · 个人科研项目**  
`CUDA C++` `PyTorch` `C++ Extension` `Nsight Compute`

面向长上下文 LLM decode 场景，围绕 paged KV cache 访问模式实现 block table 管理原型、PyTorch 基线与 C++/CUDA 扩展，完成多版 attention kernel 的设计、实现与性能分析。

**核心结果：**

- 将"两阶段 gather + attention"重构为 fused paged attention kernel，最优版本相较 PyTorch 基线实现 **2.0–3.7× 加速**
- Nsight Compute 实测显存吞吐达到 **331 GB/s**，约为理论峰值的 **94.19%**，表明该场景具有明显的 memory-bound 特征
- 进一步实现 FP16 KV cache kernel，在保持 float32 累加稳定性的前提下实现 **2× 显存节省**与最高 **1.71× 加速**

加深了对 GPU memory hierarchy、带宽瓶颈与 kernel 设计权衡的理解。

---

## NovaOS：基于 Rust 的 RISC-V64 POSIX 兼容内核

**持续迭代中 · 个人系统项目**  
`Rust` `RISC-V` `OS` `Memory Management`

基于 Rust（`no_std` / `no_main`）从零实现面向 RISC-V64 的 POSIX 兼容单体内核，支持进程管理、抢占式调度、ELF 用户程序加载，以及 `fork` / `execve` / `wait4` / `mmap` / `pipe` 等 **35 个** Linux 兼容系统调用。

**设计亮点：**

- Safe/Unsafe 分层架构，将页表、Trap、用户态访存、VirtIO MMIO 等硬件相关 `unsafe` 边界集中封装，核心模块使用 `#![deny(unsafe_code)]` 约束
- 实现 Buddy 分配器、Sv39 三级页表、`Frame` RAII、`VmSpace` 地址空间抽象
- VirtIO-blk 驱动与 Ext4 只读文件系统
- 当前已通过 **77/80** 项功能测试

---

## 面向深度学习推理的分布式语义检索系统

**2026 · 云计算课程项目**  
`Python` `Thrift RPC` `sentence-transformers` `Chord DHT`

以 Chord DHT 为存储底座，基于 sentence-transformers 构建分布式稠密向量索引；设计 Scatter-Gather 并发检索协议，在 O(log N) 跳路由下实现跨节点 top-k 语义聚合，探索向量数据库与分布式哈希结构的融合设计。

**系统特性：**

- 完整 RAG 推理管线：文档嵌入编码 → Chord 分片存储 → 语义检索 → Prompt 动态拼接 → LLM 生成
- successor list 容错机制与键值副本策略，在最多 r-1 个连续节点故障场景下维持系统连通与数据完整性
- 共通过 **82 个**单元与集成测试，覆盖一致性哈希、区间判断及数据迁移等核心路径
