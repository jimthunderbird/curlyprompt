#!/usr/bin/env python3
import urllib.request
import re
import sys
import requests
from bs4 import BeautifulSoup

def fetch_cnn_lite_news(n=2):
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
        
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def scrape_cnn_lite_article(url):
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

def summarize_with_gemma(article_content, num_of_words=40):
    url = "http://localhost:11434/api/generate"
    
    prompt = (
        f"Summarize the following article content in {num_of_words} words using very simple English: "
        f"{article_content}"
    )
    
    payload = {
        "model": "gemma3:latest",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3
        }
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json().get("response", "No summary generated.")
    except Exception as e:
        return f"Logic Error: {str(e)}"

# Main Execution
if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    news_list = fetch_cnn_lite_news(n)
    
    for item in news_list:
        content = scrape_cnn_lite_article(item['url'])
        summary = summarize_with_gemma(content.get('content', ''), 40)
        print(f"Title: {item['title']}")
        print(f"Summary: {summary}\n")
