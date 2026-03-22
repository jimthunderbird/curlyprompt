import urllib.request
import urllib.parse
import json

def run(keyword, num_of_results=1):
    """
    Searches Wikipedia for a keyword and returns page summaries.
    :param keyword: The search term to look up on Wikipedia.
    :param num_of_results: Number of results to return.
    """
    try:
        # 1. Search for matching page titles
        search_params = urllib.parse.urlencode({
            'action': 'query',
            'list': 'search',
            'srsearch': keyword,
            'srlimit': num_of_results,
            'format': 'json'
        })
        search_url = f"https://en.wikipedia.org/w/api.php?{search_params}"

        req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))

        search_results = data.get('query', {}).get('search', [])
        if not search_results:
            return []

        # 2. Fetch extracts for the found pages
        titles = '|'.join(result['title'] for result in search_results)
        extract_params = urllib.parse.urlencode({
            'action': 'query',
            'titles': titles,
            'prop': 'extracts',
            'exintro': True,
            'explaintext': True,
            'format': 'json'
        })
        extract_url = f"https://en.wikipedia.org/w/api.php?{extract_params}"

        req = urllib.request.Request(extract_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))

        pages = data.get('query', {}).get('pages', {})
        results = []
        for page_id, page in pages.items():
            if page_id == '-1':
                continue
            results.append({
                'title': page.get('title', ''),
                'extract': page.get('extract', ''),
                'url': f"https://en.wikipedia.org/wiki/{urllib.parse.quote(page.get('title', '').replace(' ', '_'))}"
            })

        return results

    except urllib.error.URLError as e:
        print(f"Network error while searching Wikipedia: {e}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []
