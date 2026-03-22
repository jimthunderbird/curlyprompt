# SKLL: Article Summarization Logic (Streaming)

## Context Mapping
- create summary using very simple English: send custom summary prompt "create N words summary of {news_content} using very very simple English words, return the summary only, no explanation, no extra words" to local llm

## Constraint
- must use import json in python

## Overview
This skill leverages a local **Ollama** instance running the **Gemma 3** model to generate real-time, streaming summaries of article content. Streaming allows for immediate visual feedback as the model processes the text on `localhost`.

---

## 1. Environment Requirements
* **Local Host:** Ollama server running on port `11434`.
* **Model:** `gemma3:latest` (Pull via `ollama pull gemma3`).
* **Protocol:** REST API (HTTP POST) with Chunked Transfer Encoding.

---

## 2. Process Logic

The streaming flow follows these steps:

1.  **Input Capture:** Receive the raw text string from the new article.
2.  **Prompt Engineering:** Instruct Gemma 3 to act as a professional summarizer.
3.  **Stream Initiation:** Send the payload to the Ollama `/api/generate` endpoint with `"stream": true`.
4.  **Iterative Decoding:** Iterate over the response chunks, parsing each JSON object and printing the `response` field immediately.

---

## 3. Implementation (Python), must import json!

```python
import requests
import json

def summarize_with_gemma_stream(article_content, custom_summary_prompt = "Summarize the following article content concisely."):
    """
    Summarizes article content using Gemma 3 via Ollama with real-time streaming.
    """
    url = "http://localhost:11434/api/generate"
    
    prompt = (
        {custom_summary_prompt}
        f"Content: {article_content}"
    )
    
    payload = {
        "model": "gemma3:latest",
        "prompt": prompt,
        "stream": True  # Enable streaming for immediate output
    }

    try:
        # Using context manager for the stream
        with requests.post(url, json=payload, stream=True) as response:
            response.raise_for_status()
            
            print("--- Summary Starting ---\n")
            for line in response.iter_lines():
                if line:
                    # Parse the JSON chunk
                    chunk = json.loads(line.decode('utf-8'))
                    token = chunk.get("response", "")
                    
                    # Print token immediately without newline
                    print(token, end="", flush=True)
                    
                    if chunk.get("done"):
                        print("\n\n--- Summary Complete ---")
    except Exception as e:
        print(f"\nLogic Error: {str(e)}")
