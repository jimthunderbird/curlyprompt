import asyncio
import json
import math
import re
import httpx
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import Counter

OLLAMA_BASE = "http://localhost:11434"
EMBED_MODEL = "nomic-embed-text"
CHAT_MODEL = "qwen3:30b-a3b"
WIKI_UA = "WikiSemanticSkill/1.0 (https://github.com/example; contact@example.com)"


async def extract_entities(question: str) -> list:
    """Use Ollama to extract entities from the question."""
    prompt = (
        "Extract the key entities (people, places, concepts, things) from this question. "
        "Return ONLY a JSON array of strings, nothing else.\n\n"
        f"Question: {question}\n\n"
        "JSON array:"
    )
    async with httpx.AsyncClient(timeout=60.0) as http:
        resp = await http.post(
            f"{OLLAMA_BASE}/api/generate",
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
        )
        if resp.status_code == 200:
            text = resp.json().get("response", "").strip()
            # Extract JSON array from response
            match = re.search(r'\[.*?\]', text, re.DOTALL)
            if match:
                return json.loads(match.group())
    return []


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


async def fetch_wikipedia_summary(pageid: int) -> str:
    """Fetch the intro summary for a Wikipedia page by ID."""
    async with httpx.AsyncClient(timeout=30.0) as http:
        params = {
            "action": "query",
            "pageids": pageid,
            "prop": "extracts",
            "exintro": 1,
            "explaintext": 1,
            "format": "json",
        }
        resp = await http.get(
            "https://en.wikipedia.org/w/api.php",
            params=params,
            headers={"User-Agent": WIKI_UA},
        )
        if resp.status_code == 200:
            pages = resp.json().get("query", {}).get("pages", {})
            for page in pages.values():
                return page.get("extract", "")
    return ""


async def fetch_wikipedia_full_content(pageid: int) -> str:
    """Fetch the full Wikipedia article content as plain text via curid URL."""
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as http:
        url = f"https://en.wikipedia.org/?curid={pageid}"
        resp = await http.get(url, headers={"User-Agent": WIKI_UA})
        if resp.status_code == 200:
            html = resp.text
            text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
            text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
    return ""


async def get_embeddings(texts: list) -> list:
    """Get embeddings from Ollama for a list of texts."""
    async with httpx.AsyncClient(timeout=60.0) as http:
        resp = await http.post(
            f"{OLLAMA_BASE}/api/embed",
            json={"model": EMBED_MODEL, "input": texts},
        )
        if resp.status_code == 200:
            return resp.json().get("embeddings", [])
    return []


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb) if na and nb else 0.0


def _ensure_nltk_data():
    """Download required nltk data if not already present."""
    for resource in ["punkt", "punkt_tab", "stopwords"]:
        try:
            nltk.data.find(f"tokenizers/{resource}" if "punkt" in resource else f"corpora/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)


def _summarize_paragraph(text: str, max_words: int = 30) -> str:
    """Extractive summary of a paragraph: score sentences by word frequency, pick top ones up to max_words."""
    sentences = sent_tokenize(text)
    if not sentences:
        return ""
    # If already short enough, return as-is
    words_all = word_tokenize(text.lower())
    if len(text.split()) <= max_words:
        return text
    # Score words by frequency (excluding stopwords)
    stop_words = set(stopwords.words("english"))
    filtered = [w for w in words_all if w.isalnum() and w not in stop_words]
    freq = Counter(filtered)
    # Score each sentence
    scored = []
    for i, sent in enumerate(sentences):
        tokens = word_tokenize(sent.lower())
        score = sum(freq.get(t, 0) for t in tokens if t.isalnum())
        scored.append((score, i, sent))
    # Pick top sentences in original order until we hit max_words
    scored.sort(reverse=True)
    selected = []
    total_words = 0
    for score, idx, sent in scored:
        sent_words = len(sent.split())
        if total_words + sent_words > max_words and selected:
            break
        selected.append((idx, sent))
        total_words += sent_words
    selected.sort()  # restore original order
    return " ".join(sent for _, sent in selected)


def condense_article(content: str) -> str:
    """Summarize each paragraph to ~30 words using nltk extractive summarization."""
    _ensure_nltk_data()
    paragraphs = content.split("\n")
    simplified = []
    for p in paragraphs:
        stripped = p.strip()
        if stripped:
            simplified.append(_summarize_paragraph(stripped, max_words=30))
    return "\n".join(simplified)


async def research_entity(entity: str, question: str) -> str:
    """Search Wikipedia for an entity, pick best match via embeddings, return condensed article."""
    print(f"\n--- Researching entity: {entity} ---")

    # Search Wikipedia for candidates
    candidates = await search_wikipedia_candidates(entity)
    if not candidates:
        print(f"  No Wikipedia results for: {entity}")
        return ""

    print(f"  Found {len(candidates)} candidates: {[c['title'] for c in candidates]}")

    # Fetch intro summaries
    summaries = await asyncio.gather(
        *[fetch_wikipedia_summary(c["pageid"]) for c in candidates]
    )
    valid = [(c, s) for c, s in zip(candidates, summaries) if s]
    if not valid:
        print(f"  No summaries available for: {entity}")
        return ""

    # Embed entity + summaries, find best match
    texts = [entity] + [s for _, s in valid]
    embeddings = await get_embeddings(texts)
    if len(embeddings) < 2:
        print(f"  Embedding failed for: {entity}")
        return ""

    q_emb = embeddings[0]
    best_idx = 0
    best_score = -1.0
    for i, emb in enumerate(embeddings[1:]):
        score = cosine_similarity(q_emb, emb)
        print(f"    {valid[i][0]['title']}: similarity = {score:.4f}")
        if score > best_score:
            best_score = score
            best_idx = i

    best_candidate = valid[best_idx][0]
    best_pageid = best_candidate["pageid"]
    best_title = best_candidate["title"]
    print(f"  Best match: {best_title} (score: {best_score:.4f}, curid: {best_pageid})")

    # Fetch full content and condense
    full_content = await fetch_wikipedia_full_content(best_pageid)
    if not full_content:
        print(f"  Could not fetch full content for: {best_title}")
        return ""

    condensed = condense_article(full_content)
    print(f"  Fetched and condensed: {len(full_content)} -> {len(condensed)} chars")
    return f"## {best_title}\n{condensed}"


async def ask_ollama(prompt: str) -> str:
    """Send a prompt to Ollama for answering, with streaming."""
    payload = {
        "model": CHAT_MODEL,
        "prompt": prompt,
        "stream": True,
    }
    full_response = ""
    async with httpx.AsyncClient(timeout=120.0) as http:
        async with http.stream("POST", f"{OLLAMA_BASE}/api/generate", json=payload) as resp:
            if resp.status_code != 200:
                await resp.aread()
                return f"Ollama error (HTTP {resp.status_code}): {resp.text}"
            async for line in resp.aiter_lines():
                if line:
                    chunk = json.loads(line)
                    token = chunk.get("response", "")
                    if token:
                        print(token, end="", flush=True)
                        full_response += token
    print()
    return full_response


async def run(question):
    """
    Multi-entity semantic Wikipedia search and answer:
    1. Use Ollama to extract entities from the question.
    2. For each entity, search Wikipedia, pick best match via embeddings.
    3. Fetch and condense each article.
    4. Merge all condensed articles into a prompt context.
    5. Ask Ollama to answer the question.
    """
    try:
        # STEP 1: Extract entities from question
        print(f"Extracting entities from: {question}")
        entities = await extract_entities(question)
        if not entities:
            msg = "Could not extract any entities from the question."
            print(msg)
            return msg
        print(f"Entities found: {entities}")

        # STEP 2: Research each entity in parallel
        research_tasks = [research_entity(entity, question) for entity in entities]
        articles = await asyncio.gather(*research_tasks)

        # Filter out empty results
        articles = [a for a in articles if a]
        if not articles:
            msg = "Could not find Wikipedia content for any entity."
            print(msg)
            return msg

        # STEP 3: Merge into prompt context and ask Ollama
        context = "\n\n".join(articles)
        prompt = (
            f"Based on the following Wikipedia article content, answer the question.\n\n"
            f"## Question\n{question}\n\n"
            f"## Wikipedia Articles\n{context}\n\n"
            f"## Answer\n"
        )
        print(f"\nMerged {len(articles)} articles ({len(context)} chars total)")
        print("Querying Ollama...")
        answer = await ask_ollama(prompt)
        result = f"# Answer (via Ollama {CHAT_MODEL})\n{answer}"
        print(result)
        return result

    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        return error_msg


if __name__ == "__main__":
    query = "How is salted fish related to cancer?"
    result = asyncio.run(run(query))
    print(result)
