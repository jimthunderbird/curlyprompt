# SKILL: Fetch CNN Lite News

This document outlines a lightweight Python script to retrieve the top `N` latest news headlines and their corresponding URLs from [CNN Lite](https://lite.cnn.com/). 

CNN Lite is a text-heavy, minimal-bandwidth version of the main news site. Because of its simplified HTML structure, we can easily scrape it without needing external dependencies like `requests` or `BeautifulSoup`. We simply use Python's built-in `urllib` to fetch the page and `re` (regular expressions) to extract both the title and the link.

---

## The Approach

The script targets `<a>` (anchor) tags where the `href` attribute starts with a year path (e.g., `/2024/`, `/2025/`, or `/2026/`). The regular expression is designed with two capture groups: one for the relative URL path and one for the headline text. Since CNN Lite uses relative links, the script prepends `https://lite.cnn.com` to make them fully formed, clickable URLs.

## The Script

```python
#!/usr/bin/env python3
import urllib.request
import re
import sys

def fetch_cnn_lite_news(n=5):
    """
    Fetches the latest n news headlines and links from CNN Lite.
    """
    base_url = "[https://lite.cnn.com](https://lite.cnn.com)"
    
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
