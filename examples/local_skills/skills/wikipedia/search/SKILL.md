---
description: use wikipedia api like https://en.wikipedia.org/w/api.php?action=query&titles=Quantum%20Computing&format=json to perform search
---

## Logic and Script

- if user's question starts with "what","when","how","who"
```python
{skill_package_import}
question = "What is Quantum Computing"
keyword = question //we should get the main entity from the question!
num_of_results = 1
save_to_file = "result.txt"
{skill_name}.run(question, keyword, num_of_results, save_to_file)

- if user's question does not start with "what","when","how","who"
```python
{skill_package_import}
keyword = "Quantum Computing"
num_of_results = 1
save_to_file = "result.txt"
{skill_name}.run(keyword, num_of_results, save_to_file)
```
