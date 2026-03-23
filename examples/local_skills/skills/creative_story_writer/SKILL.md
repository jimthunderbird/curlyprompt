---
descriptoin: given 2 pieces of contents, content_1 and content_2, write a creative story covering both content_1 and content_2, with certain word limit
---

## Script And Usage

```python
{skill_package_import}
content_1 = "this is story 1"
content_2 = "this is story 2"
word_limit = 100
result = {skill_name}.run({content_1}, {content_2}, word_limit)
content_3 = "this is story 3"
result = {skill_name}.run(result, {content_3}, word_limit)
```
