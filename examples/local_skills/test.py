#!/usr/bin/env python3
import sys
import asyncio
import re
import json
import httpx
import requests
WIKI_UA = "WikiSemanticSkill/1.0 (https://github.com/example; contact@example.com)"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:30b-a3b"


def ollama_generate(prompt: str, stream: bool = False) -> str:
    resp = requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": prompt, "stream": False},
    )
    text = resp.json()["response"]
    if "</think>" in text:
        text = text.split("</think>", 1)[1]
    return text.strip()


def extract_all_entities_from_question(question: str) -> list[str]:
    text = ollama_generate(
        f"<phrase>{question}</phrase>, extract all peoples, things and places from <phrase>, output csv version\nexample:\nquestion: how is salt and sugar related\noutput: salt,sugar"
    )
    entities = [e.strip() for e in text.split(",") if e.strip()]
    return entities


def strip_html_tags(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html)


async def fetch_article(page_id: int) -> str:
    """Fetch the full article content from Wikipedia."""
    async with httpx.AsyncClient(timeout=30.0) as http:
        params = {
            "action": "parse",
            "pageid": page_id,
            "prop": "text",
            "formatversion": 2,
            "format": "json",
        }
        resp = await http.get(
            "https://en.wikipedia.org/w/api.php",
            params=params,
            headers={"User-Agent": WIKI_UA},
        )
        html = resp.json().get("parse", {}).get("text", "")
        return strip_html_tags(html)


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


def stream_ollama(prompt: str) -> str:
    resp = requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": prompt, "stream": True},
        stream=True,
    )
    thinking = False
    output = []
    for line in resp.iter_lines():
        if not line:
            continue
        data = json.loads(line)
        token = data.get("response", "")
        if not thinking and "<think>" in token:
            token = token.split("<think>", 1)[0]
            thinking = True
        if thinking:
            if "</think>" in token:
                token = token.split("</think>", 1)[1]
                thinking = False
            else:
                continue
        output.append(token)
        print(token, end="", flush=True)
    print()
    return "".join(output)


async def main():
    question = sys.argv[1]
    print(f"Question: {question}\n")

    words = extract_all_entities_from_question(question)
    print(f"Entities: {words}\n")

    for word in words:
        items = await search_wikipedia_candidates(word, limit=1)

        for item in items:
            page_id = item["pageid"]
            page_title = item["title"]
            print(f"[{word}] → Wikipedia: {page_title} (id={page_id})")

            article = await fetch_article(page_id)
            paragraphs = [p for p in article.split("\n") if p.strip()]

            chunk_size = 8
            for i in range(0, len(paragraphs), chunk_size):
                chunk = paragraphs[i : i + chunk_size]
                context = "\n".join(chunk)
                chunk_num = i // chunk_size + 1
                total_chunks = (len(paragraphs) + chunk_size - 1) // chunk_size

                print(f"\n--- {word} chunk {chunk_num}/{total_chunks} ---")
                prompt = f"<context>{context}</context>\n<question>{question}</question>based on <context>, answer the question {question}. If the context does not contain relevant information to answer the question, reply with exactly NO_ANSWER"
                answer = stream_ollama(prompt)
                print()
                if "NO_ANSWER" not in answer:
                    return

if __name__ == "__main__":
    asyncio.run(main())
