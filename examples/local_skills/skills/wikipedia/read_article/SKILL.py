import urllib.request
import urllib.parse
import re
import sys

def run(article_url):
    """
    Given a Wikipedia article URL, fetches and returns its content as plain text.
    :param article_url: Full URL to a Wikipedia article (e.g. https://en.wikipedia.org/?curid=25284).
    """
    try:
        # Extract the page ID from the URL
        parsed = urllib.parse.urlparse(article_url)
        query_params = urllib.parse.parse_qs(parsed.query)
        curid = query_params.get('curid', [None])[0]
        if not curid:
            return "Invalid URL: expected ?curid= parameter."

        # Use the Wikipedia API to get plain text content
        params = urllib.parse.urlencode({
            'action': 'query',
            'pageids': curid,
            'prop': 'extracts',
            'explaintext': True,
            'format': 'json'
        })
        api_url = f"https://en.wikipedia.org/w/api.php?{params}"

        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            import json
            data = json.loads(response.read().decode('utf-8'))

        pages = data.get('query', {}).get('pages', {})
        for page_id, page in pages.items():
            if page_id == '-1':
                return "Article not found."
            return page.get('extract', '')

        return "Article not found."

    except urllib.error.URLError as e:
        print(f"Network error while fetching Wikipedia article: {e}")
        return ""
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return ""
