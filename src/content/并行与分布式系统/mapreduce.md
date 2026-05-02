---
title: "MapReduce note"
date: "2026-04-26"
category: "distributed system"
status: "draft"
deck: ""
fill: "mint"
deploy: false
---
# MapReduce 论文读后笔记
>MapReduce 让程序员只需要写 Map 和 Reduce 两个函数，系统自动把计算分发到成百上千台机器上，并处理数据划分、任务调度、机器故障、网络通信和负载均衡。

## Introduction
在大型系统中我们要区分两类复杂性：
+ 业务逻辑复杂性：比如统计词频、构建索引、过滤日志。
+ 分布式系统复杂性：比如并行化、数据分发、容错、负载均衡。

很多时候业务逻辑其实比较简单，而第二种复杂性才是关键，`mapreduce`就是一个把第二类问题封装掉的编程模型。