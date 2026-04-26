---
title: "What KV Cache Eviction Is Really Optimizing"
date: "2026-03-18"
category: "RESEARCH NOTE"
status: "planned"
deck: "A short map from SnapKV and H2O to semantic-aware eviction signals."
fill: "mint"
---

# What KV Cache Eviction Is Really Optimizing

Most KV cache eviction methods look like they are optimizing memory, but the real target is retrieval fidelity under a fixed memory budget.

Attention scores are useful, but they are also noisy proxies. A token can receive attention because it is recent, syntactically convenient, or genuinely important for the answer.

That distinction matters when the context gets long.

## Sketch

- H2O keeps recent tokens and accumulated heavy hitters.
- SnapKV uses prompt-window voting to select likely useful positions.
- Semantic-aware eviction asks whether a token is useful for the current query, not just whether it was attended to.
