---
description: use wikipedia api like https://en.wikipedia.org/w/api.php?action=query&titles=Quantum%20Computing&format=json to perform search
---

## Script And Usage

```python
{skill_package_import}
keyword = "Quantum Computing"
num_of_results = 1
results = {skill_name}.run(keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract'] //this is the summary of the article
```
