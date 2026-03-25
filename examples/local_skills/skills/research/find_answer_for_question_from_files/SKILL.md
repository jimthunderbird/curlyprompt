---
description: given a question and one or more file paths, read the files as context and use ollama to answer the question
---

## The Script And Usage

```python
{skill_package_import}
question = "How are these two topics related?"
file1 = "topic_a_findings.txt"
file2 = "topic_b_findings.txt"
{skill_name}.run(question, file1, file2)
```
