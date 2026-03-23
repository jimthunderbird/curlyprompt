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
results = {skill_name}.run(question, keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract'] //this is the summary of the article
```
  content: read file content from url 
  construct prompt: "
  forget about your previous knowledge, based only on the following facts, answer the question: {user's question}
  facts {
    {content}
  }
  " 
  send prompt to ollama model gemma3:latest with streaming

- if user's question does not start with "what","when","how","who"
```python
{skill_package_import}
keyword = "Quantum Computing"
num_of_results = 1
results = {skill_name}.run(keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract'] //this is the summary of the article
```
