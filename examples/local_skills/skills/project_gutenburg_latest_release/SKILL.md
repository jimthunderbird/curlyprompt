# Skill: Find Latest Project Gutenberg Releases

Track and retrieve the most recent eBook additions to the Project Gutenberg library, including a brief summary for each.

## 1. Official RSS Feed + Metadata Enrichment
Project Gutenberg's nightly feed provides the "what," while the Gutendex API provides the "context" (summaries and subjects).

* **Feed URL:** `https://www.gutenberg.org/cache/epub/feeds/today.rss`
* **Format:** XML/RSS + JSON Metadata.

### How to use with Python
You will need the `feedparser` and `requests` libraries:
`pip install feedparser requests`

```python
import feedparser
import requests

def get_book_details(book_id):
    """Fetches summary/subjects from the Gutendex API."""
    api_url = f"[https://gutendex.com/books/?ids=](https://gutendex.com/books/?ids=){book_id}"
    try:
        response = requests.get(api_url).json()
        if response['results']:
            book = response['results'][0]
            # Try to get a summary; if empty, join the subjects together
            summary = book.get('summaries')
            if summary:
                return summary[0]
            return "Subjects: " + ", ".join(book.get('subjects', ['No summary available.']))
    except Exception:
        return "Metadata temporarily unavailable."
    return "No summary available."

def get_latest_gutenberg(limit=5):
    feed_url = "[https://www.gutenberg.org/cache/epub/feeds/today.rss](https://www.gutenberg.org/cache/epub/feeds/today.rss)"
    feed = feedparser.parse(feed_url)
    
    print(f"--- Latest {limit} Project Gutenberg Releases ---\n")
    
    for entry in feed.entries[:limit]:
        # Extract ID from link (e.g., '[https://www.gutenberg.org/ebooks/72831](https://www.gutenberg.org/ebooks/72831)')
        book_id = entry.link.split('/')[-1]
        
        summary = get_book_details(book_id)
        
        print(f"Title:   {entry.title}")
        print(f"Summary: {summary}")
        print(f"Link:    {entry.link}")
        print("-" * 30 + "\n")

if __name__ == "__main__":
    get_latest_gutenberg()
