# Skill: Python Article Summarizer (Ollama Edition)

## Description
A Python-based skill that scrapes web content and generates a summary using the **Qwen3-Coder:30b** model via a local **Ollama** instance. It ensures the output strictly adheres to a user-specified word count of **N**.

## Dependencies
* `requests`: For fetching article content.
* `beautifulsoup4`: For parsing HTML and extracting clean text.
* `ollama`: The official Python SDK for interacting with local Ollama models.

## Parameters
* `url` (str): The web address of the article (e.g., `https://www.cnn.com/...`).
* `n` (int): The target word count for the summary.

## Python Implementation
```python
import requests
from bs4 import BeautifulSoup
import ollama

def summarize_with_qwen(url, n):
    # 1. Scrape the content
    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # Extract text from paragraph tags
    text = " ".join([p.get_text() for p in soup.find_all('p')])

    # 2. Construct the summary prompt
    prompt = f"""
    Summarize the following article in exactly {n} words. 
    Maintain a professional tone and ensure the word count is strictly {n}.

    Article:
    {text}
    """

    # 3. Call Ollama with qwen3-coder:30b
    response = ollama.generate(
        model='qwen3-coder:30b',
        prompt=prompt
    )
    
    return response['response']
