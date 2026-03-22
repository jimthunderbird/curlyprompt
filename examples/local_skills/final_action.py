#!/usr/bin/env python3
import urllib.request
import re
import sys

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

def fetch_iran_related_news(n=5):
    """
    Fetches top n news items related to Iran from CNN Lite.
    """
    news_list = fetch_cnn_lite_news(n * 3)  # Fetch more to ensure we get enough Iran-related ones
    iran_news = []
    
    for item in news_list:
        if 'iran' in item['title'].lower():
            iran_news.append(item)
            if len(iran_news) >= n:
                break
    
    return iran_news

def scrape_cnn_lite_article(url):
    """
    Extracts structured news data from CNN Lite using specific CSS selectors.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
        
        # Extract headline
        headline_match = re.search(r'<h2[^>]*class="headline"[^>]*>(.*?)</h2>', html, re.DOTALL)
        headline = headline_match.group(1).strip() if headline_match else "No Headline"
        
        # Extract byline
        byline_match = re.search(r'<p[^>]*class="byline--lite"[^>]*>(.*?)</p>', html, re.DOTALL)
        author = byline_match.group(1).strip() if byline_match else "No Author Info"

        # Extract article content
        content_match = re.search(r'<article[^>]*class="article--lite"[^>]*>(.*?)</article>', html, re.DOTALL)
        if content_match:
            article_html = content_match.group(1)
            # Remove all HTML tags and extract text
            content = re.sub(r'<[^>]+>', '', article_html)
            content = re.sub(r'\s+', ' ', content).strip()
        else:
            content = "No article body found."

        return {
            "headline": headline,
            "author": author,
            "content": content
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Fetch top 5 Iran-related news items
    iran_news = fetch_iran_related_news(5)
    
    for i, item in enumerate(iran_news, start=1):
        print(f"\n{i}. {item['title']}")
        print(f"URL: {item['url']}")
        
        # Scrape full article content
        article_data = scrape_cnn_lite_article(item['url'])
        if "error" not in article_data:
            print(f"Author: {article_data['author']}")
            print("Content Preview:")
            print(article_data['content'][:300] + "..." if len(article_data['content']) > 300 else article_data['content'])
        else:
            print(f"Error fetching content: {article_data['error']}")
