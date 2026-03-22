#!/usr/bin/env python3
import urllib.request
import re
import sys
import requests
from bs4 import BeautifulSoup

def fetch_cnn_lite_news(n=5):
    """
    Fetches the latest n news headlines and links from CNN Lite.
    """
    base_url = "https://lite.cnn.com"
    
    try:
        # Pass a standard User-Agent to prevent basic bot-blocking
        req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        # Regex captures the href path (group 1) and the headline text (group 2)
        pattern = r'<a href="(/20\d{2}[^"]*)">([^<]+)</a>'
        matches = re.findall(pattern, html)
        
        # Format into a list of dictionaries with absolute URLs
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

        # 1. Target the main layout container
        container = soup.find('div', class_='layout-article-elevate__lite')
        
        if not container:
            return {"error": "Target container 'layout-article-elevate__lite' not found."}

        # 2. Extract Headline (h2 class="headline")
        headline_element = container.find('h2', class_='headline')
        headline = headline_element.get_text(strip=True) if headline_element else "No Headline"

        # 3. Extract Author Information (p class="byline--lite")
        byline_element = container.find('p', class_='byline--lite')
        author = byline_element.get_text(strip=True) if byline_element else "No Author Info"

        # 4. Extract Article Details (article class="article--lite")
        article_wrapper = container.find('article', class_='article--lite')
        if article_wrapper:
            # Join all paragraphs within the article tag
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
    """
    Summarizes article content using Gemma 3 via Ollama localhost.
    """
    url = "http://localhost:11434/api/generate"
    
    # Define the summarization logic/constraints
    prompt = (
        f"Summarize the following article content in {num_of_words} words using very simple English. "
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

# Main execution logic
if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    news_list = fetch_cnn_lite_news(n)
    
    for item in news_list:
        article_content = scrape_cnn_lite_article(item['url'])
        summary = summarize_with_gemma(article_content['content'], 40)
        print(f"Title: {item['title']}")
        print(f"Summary: {summary}")
        print()
