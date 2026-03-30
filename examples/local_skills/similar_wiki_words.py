#!/usr/bin/env python3
import sys
import json
import asyncio
import argparse
import requests
import httpx

WIKI_UA = "WikiSemanticSkill/1.0 (https://github.com/example; contact@example.com)"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:30b-a3b"


def ollama_generate(prompt: str) -> str:
    resp = requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": prompt, "stream": False},
    )
    text = resp.json()["response"]
    if "</think>" in text:
        text = text.split("</think>", 1)[1]
    return text.strip()


def extract_focus_entity(question: str) -> str:
    text = ollama_generate(
        f"<question>{question}</question>\nExtract the single most important entity (person, thing, or place) from <question>. Output ONLY the entity name, nothing else.\nexample:\nquestion: how does photosynthesis work in plants\noutput: photosynthesis"
    )
    return text.strip().strip('"').strip("'")


async def fetch_related_wiki_terms(query: str, limit: int = 20) -> list[str]:
    try:
        async with httpx.AsyncClient(timeout=30.0) as http:
            params = {
                "action": "opensearch",
                "search": query,
                "limit": limit,
                "namespace": 0,
                "format": "json",
            }
            resp = await http.get(
                "https://en.wikipedia.org/w/api.php",
                params=params,
                headers={"User-Agent": WIKI_UA},
            )
            if resp.status_code == 200:
                data = resp.json()
                return data[1] if len(data) > 1 else []
    except Exception as e:
        print(f"Wikipedia related terms error: {e}")
    return []


async def fetch_page_ids(titles: list[str]) -> dict[str, int]:
    """Fetch Wikipedia page IDs for a list of titles."""
    page_ids = {}
    try:
        async with httpx.AsyncClient(timeout=30.0) as http:
            # API accepts up to 50 titles per request
            for batch_start in range(0, len(titles), 50):
                batch = titles[batch_start : batch_start + 50]
                params = {
                    "action": "query",
                    "titles": "|".join(batch),
                    "format": "json",
                }
                resp = await http.get(
                    "https://en.wikipedia.org/w/api.php",
                    params=params,
                    headers={"User-Agent": WIKI_UA},
                )
                if resp.status_code == 200:
                    pages = resp.json().get("query", {}).get("pages", {})
                    for pid, info in pages.items():
                        if int(pid) > 0:
                            page_ids[info["title"]] = int(pid)
    except Exception as e:
        print(f"Wikipedia page ID fetch error: {e}")
    return page_ids


async def fetch_article_extract(page_id: int) -> str:
    """Fetch the plain-text extract of a Wikipedia article by page ID."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as http:
            params = {
                "action": "query",
                "pageids": page_id,
                "prop": "extracts",
                "explaintext": True,
                "redirects": 1,
                "format": "json",
            }
            resp = await http.get(
                "https://en.wikipedia.org/w/api.php",
                params=params,
                headers={"User-Agent": WIKI_UA},
            )
            if resp.status_code == 200:
                pages = resp.json().get("query", {}).get("pages", {})
                # After redirect, the page ID in the response may differ
                # from the requested one, so just grab the first page
                for page in pages.values():
                    return page.get("extract", "")
    except Exception as e:
        print(f"Wikipedia extract fetch error: {e}")
    return ""


def stream_question(article_text: str, entity_name: str, question: str) -> str:
    """Stream an answer by searching through article paragraphs."""
    paragraphs = [p.strip() for p in article_text.split("\n") if p.strip()]
    for i, paragraph in enumerate(paragraphs):
        prompt = (
            f"Based on the following paragraph from a Wikipedia article about '{entity_name}', "
            f"answer this question: {question}\n\n"
            f"If the paragraph does NOT contain enough information to answer the question, "
            f"respond with exactly 'NO_ANSWER'. Otherwise, provide a concise answer.\n\n"
            f"{paragraph}"
        )
        answer = _stream_ollama(MODEL, prompt)
        if "NO_ANSWER" not in answer:
            return answer
    return "NO_ANSWER"


def _stream_ollama(model: str, prompt: str) -> str:
    """Stream ollama output, stripping <think> blocks. Returns full text."""
    resp = requests.post(
        OLLAMA_URL,
        json={"model": model, "prompt": prompt, "stream": True},
        stream=True,
    )
    thinking = False
    buffer = ""
    full_output = ""
    for line in resp.iter_lines():
        if line:
            chunk = json.loads(line)
            token = chunk.get("response", "")
            if not thinking and token.startswith("<think>"):
                thinking = True
                buffer = token
                continue
            if thinking:
                buffer += token
                if "</think>" in buffer:
                    after = buffer.split("</think>", 1)[1]
                    print(after, end="", flush=True)
                    full_output += after
                    thinking = False
            else:
                print(token, end="", flush=True)
                full_output += token
            if chunk.get("done"):
                break
    print()
    return full_output.strip()


async def main():
    parser = argparse.ArgumentParser(description="Find related Wikipedia entities and answer questions.")
    parser.add_argument("--context", required=False, help="Topic context for finding related Wikipedia entities")
    parser.add_argument("--question", required=True, help="Question to answer using wiki articles.")
    args = parser.parse_args()

    if args.context is None:
        args.context = args.question

    print(f"Context: {args.context}\n")

    entity = extract_focus_entity(args.context)
    print(f"Focus entity: {entity}\n")

    terms = await fetch_related_wiki_terms(entity, limit=20)
    if not terms:
        print(f"No related Wikipedia entities found for '{entity}'.")
        return

    page_ids = await fetch_page_ids(terms)
    print(f"20 most related Wikipedia entities for '{entity}':")
    for i, term in enumerate(terms, 1):
        pid = page_ids.get(term, "N/A")
        print(f"  {i}. {term} (page_id: {pid})")

    print(f"\n--- Searching for answer: {args.question} ---\n")
    for term in terms:
        pid = page_ids.get(term)
        if pid is None:
            continue
        print(f"[{term}] asking question against article (page_id: {pid})...")
        extract = await fetch_article_extract(pid)
        if not extract:
            print(f"  (no article text found)\n")
            continue
        answer = stream_question(extract, term, args.question)
        if "NO_ANSWER" not in answer:
            print(f"\n--- Answer found via '{term}' ---\n")
            return
        else:
            print()


if __name__ == "__main__":
    asyncio.run(main())
