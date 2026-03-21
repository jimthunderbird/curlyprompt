#!/usr/bin/env python3
import urllib.request
import re
import json

def fetch_cnn_lite_news(n=1):
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

def main(payload):
    n = payload.get('n', 1)
    news = fetch_cnn_lite_news(n)
    return json.dumps(news)