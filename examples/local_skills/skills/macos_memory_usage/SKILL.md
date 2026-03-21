# macOS Memory Usage Skills

Below are the primary commands for checking available and used RAM on macOS via the Terminal.

## 1. Quick Snapshot (Recommended)
This command provides a concise summary of used versus unused physical memory in a single line.
```bash
top -l 1 -s 0 | grep PhysMem
