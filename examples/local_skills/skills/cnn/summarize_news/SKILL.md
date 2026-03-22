# SKLL: Article Summarization Logic

## Overview
This skill leverages a local **Ollama** instance running the **Gemma 3** model to generate concise summaries of article content. By keeping the processing on `localhost`, it ensures data privacy and low-latency performance.

---

## 1. Environment Requirements
* **Local Host:** Ollama server running on port `11434`.
* **Model:** `gemma3:latest` (Pull via `ollama pull gemma3`).
* **Protocol:** REST API (HTTP POST).

---

## 2. Process Logic

The summarization flow follows these steps:

1.  **Input Capture:** Receive the raw text string from the new article.
2.  **Prompt Engineering:** Wrap the content in a directive that instructs Gemma 3 to act as a professional summarizer.
3.  **Local Inference:** Send the payload to the Ollama `/api/generate` endpoint.
4.  **Parsing:** Extract the text response from the JSON output.

---

## 3. Implementation (Python)

```python
import requests

def summarize_with_gemma(article_content):
    """
    Summarizes article content using Gemma 3 via Ollama localhost.
    """
    url = "http://localhost:11434/api/generate"
    
    # Define the summarization logic/constraints
    prompt = (
        "Summarize the following article content. "
        "Provide a 1-sentence 'TL;DR' followed by 3 key bullet points.\n\n"
        f"Content: {article_content}"
    )
    
    payload = {
        "model": "gemma3:latest",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3  # Lower temperature for factual consistency
        }
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json().get("response")
    except Exception as e:
        return f"Logic Error: {str(e)}"

# Usage
# result = summarize_with_gemma("Your long article text here...")
