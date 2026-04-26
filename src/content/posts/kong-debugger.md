---
title: "Kong Debugger: Rebuilding A Debugger In Rust"
date: "2026-04-20"
category: "BUILD LOG"
status: "draft"
deck: "Notes on ptrace, INT3 breakpoints, DWARF symbols, and why memory safety matters in debugger internals."
fill: "yellow"
---

# Kong Debugger

Kong Debugger is my attempt to rebuild the core loop of a debugger in Rust: launch or attach to a process, stop it, inspect it, modify its execution state, and continue.

The interesting part is not just reproducing a few familiar GDB commands. It is figuring out where the debugger is allowed to be unsafe, and how much of that unsafety can be isolated behind small, testable boundaries.

## Notes

- `ptrace` gives the debugger process control over the tracee.
- `INT3` (`0xcc`) is enough to build software breakpoints.
- DWARF is where source-level debugging becomes real: line tables, symbols, frame information, and variable locations all live there.

The current direction is to keep the command surface small: `run`, `break`, `continue`, `next`, `print`, `backtrace`, and `quit`.
