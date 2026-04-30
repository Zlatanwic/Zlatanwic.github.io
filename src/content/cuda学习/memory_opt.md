---
title: "Memory Optimizations"
date: "2026-04-26"
category: "cuda memory"
status: "draft"
deck: ""
fill: "mint"
deploy: false
---
# Memory Optimizations
memory 优化是cuda device优化中的很重要一环，用来优化bandwidth。意思是尽可能更多地访问快速内存而尽可能更少地访问慢速内存
## host与device之间的数据转移
gpu之间的最大理论带宽远高于gpu与cpu之间的最大理论带宽，所以应该尽量减少host到device的数据传输，并且在gpu上运行kernel，即使这相比于在cpu上运行没有明显的提升。

所以应该在device中创建数据并销毁，并且尽量将小的传输合并为大的传输
### pinned memory
普通的host侧内存是可以被os来分片的，可能随时移动到硬盘，而`pinned memory`是固定在内存的，与gpu的数据传输速率更快，因为普通内存需要先转成`pinned`中间态再和gpu通信，而`pinned memory`不需要转换的过程，就会更快
```cpp
float* h_a;
cudaHostAlloc((void**)&h_a, size, cudaHostAllocDefault);
```