---
description: Search Wikipedia and answer questions using Wikipedia content via a local ollama LLM (qwen3-coder:30b)
---

## Functions

### `search(keyword, num_of_results=1)`
Searches Wikipedia using the opensearch API and returns a list of results with `title`, `url`, and `extract` (intro text).

### `run(question, keyword, num_of_results=1, save_to_file=None)`
Main entry point. Searches Wikipedia for `keyword`, reads the full content of the first result, constructs a fact-based prompt, and streams it to ollama (`qwen3-coder:30b`) for an answer. If `save_to_file` is provided, the response is appended to that file.

### `run_related(question, entities)`
Handles questions involving multiple entities where the user wants to know how they are related. For each entity, searches Wikipedia and reads the full content. Then combines all facts into a single prompt and asks ollama whether and how the entities are related.

### `read_content_from_url(url)`
Reads the full plain text content from a Wikipedia page URL (supports `curid`, `title`, and `/wiki/` path formats).

### `send_to_ollama(prompt, model="qwen3-coder:30b")`
Sends a prompt to the local ollama instance at `http://localhost:11434/api/generate` and streams the response.

### `is_question(text)`
Returns `True` if the text starts with "what", "when", "how", or "who".

## Logic and Script

- if the user's question involves multiple persons:
break the user's question into N small questions, one for each person
example:
- question: what is obama, warren buffett, donald trump, isaac newton's birthday and birth place
- code:
```python
import asyncio
{skill_package_import}

async def main():
    persons = ["obama", "warren buffett", "donald trump", "isaac newton"]
    save_to_file = "result.txt"
    # empty the file first
    with open(save_to_file, 'w', encoding='utf-8') as f:
        pass

    results = []
    for person in persons:
        keyword = person
        question = f"what is {person}'s birthday and birth place"
        num_of_results = 1
        await {skill_name}.run(question, keyword, num_of_results, save_to_file)

asyncio.run(main())
```

- if the user's question involves multiple entities and would like to know how are they related:
  use `run_related(question, entities)` which handles fetching content for each entity and asking ollama about their relationship.
  example:
- question: how are salt, sugar, and cancer related?
- code:
```python
import asyncio
{skill_package_import}

async def main():
    question = "how are salt, sugar, and cancer related?"
    entities = ["salt", "sugar", "cancer"]
    await {skill_name}.run_related(question, entities)

asyncio.run(main())
```
  Note: all async calls must be inside an `async def` function and run via `asyncio.run()`.
