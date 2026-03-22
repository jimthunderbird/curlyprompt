#!/usr/bin/env python3
import urllib.request
import re
import sys
import requests
from bs4 import BeautifulSoup
import json

def fetch_cnn_lite_news(n=5):
    """
    Fetches the latest n news headlines and links from CNN Lite.
    """
    base_url = "https://lite.cnn.com"
    
    try:
        req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        pattern = r'<a href="(/20\d{2}[^"]*)">([^<]+)</a>'
        matches = re.findall(pattern, html)
        
        news_items = []
        for link, title in matches[:n]:
            news_items.append({
                "title": title.strip(),
                "url": f"{base_url}{link}"
            })
            
        return news_items
        
    except urllib.error.URLError as e:
        print(f"Network error while fetching news: {e}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

def scrape_cnn_lite_article(url):
    """
    Extracts structured news data from CNN Lite using specific CSS selectors.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')

        container = soup.find('div', class_='layout-article-elevate__lite')
        
        if not container:
            return {"error": "Target container 'layout-article-elevate__lite' not found."}

        headline_element = container.find('h2', class_='headline')
        headline = headline_element.get_text(strip=True) if headline_element else "No Headline"

        byline_element = container.find('p', class_='byline--lite')
        author = byline_element.get_text(strip=True) if byline_element else "No Author Info"

        article_wrapper = container.find('article', class_='article--lite')
        if article_wrapper:
            paragraphs = [p.get_text(strip=True) for p in article_wrapper.find_all('p')]
            content = "\n\n".join(paragraphs)
        else:
            content = "No article body found."

        return {
            "headline": headline,
            "author": author,
            "content": content
        }

    except Exception as e:
        return {"error": str(e)}

def summarize_with_gemma_stream(article_content, custom_summary_prompt="Summarize the following article content concisely."):
    """
    Summarizes article content using Gemma 3 via Ollama with real-time streaming.
    """
    url = "http://localhost:11434/api/generate"
    
    prompt = f"{custom_summary_prompt} Content: {article_content}"
    
    payload = {
        "model": "gemma3:latest",
        "prompt": prompt,
        "stream": True
    }

    try:
        with requests.post(url, json=payload, stream=True) as response:
            response.raise_for_status()
            
            print("--- Summary Starting ---\n")
            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line.decode('utf-8'))
                    token = chunk.get("response", "")
                    
                    print(token, end="", flush=True)
                    
                    if chunk.get("done"):
                        print("\n\n--- Summary Complete ---")
    except Exception as e:
        print(f"\nLogic Error: {str(e)}")

# Main Execution
if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    
    top_news = fetch_cnn_lite_news(n)
    
    for news in top_news:
        print(f"\nTitle: {news['title']}")
        article_data = scrape_cnn_lite_article(news['url'])
        
        if "error" not in article_data:
            content = article_data["content"]
            summarize_with_gemma_stream(content, f"Create 40 words summary of {content} using very very simple English words")
        else:
            print(f"Error fetching article: {article_data['error']}")
