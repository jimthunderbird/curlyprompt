# Skill: File Handling in Python 3.11

This guide covers the fundamental patterns for writing data to files using modern Python practices.

---

## 1. The Basic "Write" Pattern
The `with` statement (context manager) is the safest way to write files. It ensures resources are freed properly even if an error occurs.

```python
# Writing a simple string to a text file
with open("example.txt", mode="w", encoding="utf-8") as f:
    f.write("Hello, Python 3.11!\n")
    f.write("This is a new line.")
