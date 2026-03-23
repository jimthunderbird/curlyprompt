---
descriptoin: given 2 pieces of contents, content_1 and content_2,...,content_N, write a creative story covering both content_1 and content_2, with certain word limit
---

## Script And Usage

```python
{skill_package_import}
content_1 = "this is story 1"
content_2 = "this is story 2"
content_3 = "this is story 3"
word_limit = 100
constraint = "use shakespear tone"
{skill_name}.run({content_1}, {content_2}, {content_3}, word_limit, constraint), call only, do not print result
```
