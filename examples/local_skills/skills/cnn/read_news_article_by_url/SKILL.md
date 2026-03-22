# CNN Lite Content Extraction Skill

This skill provides a Python 3 solution for programmatically reading and extracting news content from CNN's lightweight portal (`lite.cnn.com`). This is the most efficient way to get news data without the overhead of ads, trackers, or heavy JavaScript.

The python script should take a first command line argument N, where N stands for number of news we want to fetch

```python
import requests
from bs4 import BeautifulSoup

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
