---
description: Search Wikipedia and answer questions using Wikipedia content via a local ollama LLM (qwen3-coder:30b)
---

## Functions

### `search(keyword, num_of_results=1)`
Searches Wikipedia using the opensearch API and returns a list of results with `title`, `url`, and `extract` (intro text).

### `run(question, keyword, num_of_results=1, save_to_file=None)`
Main entry point. Searches Wikipedia for `keyword`, reads the full content of the first result, constructs a fact-based prompt, and streams it to ollama (`qwen3-coder:30b`) for an answer. If `save_to_file` is provided, the response is appended to that file.

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
  for each entity:
    - search wiki on what is {entity}
    - entity: replace " " in {entity} with "_"
    - save the findings to {entity}_findings.txt
  based on the related *_findings.txt, use skills.research.find_answer_for_question_from_files.run(...)
  Note: all async calls must be inside an `async def` function and run via `asyncio.run()`.

### Basic usage

```python
import asyncio
{skill_package_import}

async def main():
    question = "What is Quantum Computing"
    keyword = "Quantum Computing"
    num_of_results = 1
    save_to_file = "result.txt"
    await {skill_name}.run(question, keyword, num_of_results, save_to_file)

asyncio.run(main())
```
