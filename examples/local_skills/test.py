import sys
import asyncio
import httpx

WIKI_UA = "WikiSemanticSkill/1.0 (https://github.com/example; contact@example.com)"


async def search_wikipedia_candidates(query: str, limit: int = 5) -> list:
    """Search Wikipedia and return top candidate results with snippets."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as http:
            params = {
                "action": "query",
                "list": "search",
                "srsearch": query,
                "srlimit": limit,
                "format": "json",
            }
            resp = await http.get(
                "https://en.wikipedia.org/w/api.php",
                params=params,
                headers={"User-Agent": WIKI_UA},
            )
            if resp.status_code == 200:
                return resp.json().get("query", {}).get("search", [])
            else:
                print(f"Wikipedia search returned HTTP {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"Wikipedia search error: {e}")
    return []


async def main():
    word = sys.argv[1]
    items = await search_wikipedia_candidates(word, limit=10)
    for item in items:
        print(f"{item['pageid']}:{item['title']}")


if __name__ == "__main__":
    asyncio.run(main())
