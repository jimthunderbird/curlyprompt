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
    """Fetch the full Wikipedia article content as plain text via the MediaWiki API."""
    async with httpx.AsyncClient(timeout=30.0) as http:
        params = {
            "action": "query",
            "pageids": pageid,
            "prop": "extracts",
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


def _summarize_paragraph(text: str, max_words: int = 200) -> str:
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
    """Summarize each paragraph to 30 words using nltk extractive summarization."""
    _ensure_nltk_data()
    paragraphs = content.split("\n")
    simplified = []
    for p in paragraphs:
        stripped = p.strip()
        if stripped:
            simplified.append(_summarize_paragraph(stripped, max_words=30))
    return "\n".join(simplified)


async def select_best_candidates(question: str, entities: list, all_candidates: dict) -> dict:
    """Use Ollama to select the best Wikipedia candidate for each entity given the question context."""
    entity_lines = []
    for entity in entities:
        candidates = all_candidates.get(entity, [])
        titles = ", ".join(repr(c["title"]) for c in candidates)
        entity_lines.append(f"entity {entity}: {titles}")

    prompt = (
        f"I have a question: {question}\n"
        f"There are {len(entities)} entities in this question:\n"
        f"Related wikipedia items for each entity:\n"
        + "\n".join(entity_lines) + "\n"
        + "return only the one most related wiki item for each entity\n"
        + "format:\n"
        + ", ".join(f"item{i+1}" for i in range(len(entities))) + "\n"
        + "return the items only, no explanation and no extra words"
    )

    print(f"\n--- Selecting best candidates via LLM ---")
    print(f"  Prompt:\n{prompt}")

    async with httpx.AsyncClient(timeout=60.0) as http:
        resp = await http.post(
            f"{OLLAMA_BASE}/api/generate",
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
        )
        if resp.status_code == 200:
            text = resp.json().get("response", "").strip()
            print(f"  LLM response: {text}")
            # Clean up: strip quotes, whitespace from each title
            selected_titles = [t.strip().strip("'\"") for t in text.split(",")]
            # Map selected titles back to candidates with page IDs
            result = {}
            for title in selected_titles:
                title_lower = title.lower()
                for entity, candidates in all_candidates.items():
                    if entity in result:
                        continue
                    for c in candidates:
                        if c["title"].lower() == title_lower:
                            result[entity] = c
                            break
            # Fallback: for any entity without a match, use the first candidate
            for entity, candidates in all_candidates.items():
                if entity not in result and candidates:
                    print(f"  Warning: no exact LLM match for entity '{entity}', using first candidate: {candidates[0]['title']}")
                    result[entity] = candidates[0]
            return result
    return {}


async def fetch_and_condense(entity: str, candidate: dict) -> str:
    """Fetch full Wikipedia content for a candidate and return condensed article."""
    pageid = candidate["pageid"]
    title = candidate["title"]
    print(f"\n--- Fetching article for entity '{entity}': {title} (curid: {pageid}) ---")

    full_content = await fetch_wikipedia_full_content(pageid)
    if not full_content:
        print(f"  Could not fetch full content for: {title}")
        return ""

    condensed = condense_article(full_content)
    print(condensed)
    print(f"  Fetched and condensed: {len(full_content)} -> {len(condensed)} chars")
    return f"## {title}\n{condensed}"


async def search_article_paragraphs(question: str, entity: str, candidate: dict) -> dict:
    """Fetch a Wikipedia article, split into paragraphs, and search 5 at a time for the answer.
    Returns a dict with 'answer' (str|None) and 'summary' (str)."""
    pageid = candidate["pageid"]
    title = candidate["title"]
    print(f"\n--- Fetching article for entity '{entity}': {title} (curid: {pageid}) ---")

    full_content = await fetch_wikipedia_full_content(pageid)
    if not full_content:
        print(f"  Could not fetch full content for: {title}")
        return {"answer": None, "summary": ""}

    # Split into non-empty paragraphs
    paragraphs = [p.strip() for p in full_content.split("\n") if p.strip()]
    print(f"  Article has {len(paragraphs)} paragraphs")

    # Process in batches of 5
    total_batches = (len(paragraphs) + 4) // 5
    found_answer = None
    for i in range(0, len(paragraphs), 5):
        batch = paragraphs[i:i + 5]
        batch_text = "\n\n".join(batch)
        batch_num = i // 5 + 1
        print(f"\n  --- Checking paragraphs {i+1}-{i+len(batch)} (batch {batch_num}/{total_batches}) ---")

        answer = await _check_batch_for_answer(question, title, batch_text, batch_num)
        if answer and not found_answer:
            print(f"\n  *** Answer found! ***\n  {answer}")
            found_answer = answer
            break

    if not found_answer:
        print(f"  No answer found in article: {title}")

    # Always generate a 200-word summary using ollama
    print(f"\n  --- Generating 200-word summary for '{title}' ---")
    summary = await _generate_summary(title, full_content)
    print(f"  Summary:\n{summary}")

    return {"answer": found_answer, "summary": summary}


async def _generate_summary(title: str, full_content: str) -> str:
    """Generate a 200-word summary of a Wikipedia article using Ollama."""
    prompt = (
        f"Summarize the following Wikipedia article '{title}' in approximately 200 words.\n\n"
        f"Article:\n{full_content[:8000]}\n\n"
        f"Summary (200 words):"
    )
    async with httpx.AsyncClient(timeout=120.0) as http:
        resp = await http.post(
            f"{OLLAMA_BASE}/api/generate",
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
        )
        if resp.status_code == 200:
            return resp.json().get("response", "").strip()
    return ""


async def _check_batch_for_answer(question: str, title: str, batch_text: str, batch_label) -> str | None:
    """Check a batch of paragraphs for the answer to a question via LLM."""
    prompt = (
        f"Based on the following excerpt from the Wikipedia article '{title}', "
        f"can you answer this question?\n\n"
        f"Question: {question}\n\n"
        f"Excerpt:\n{batch_text}\n\n"
        f"If the excerpt contains enough information to answer the question, "
        f"respond with: ANSWER: <your answer>\n"
        f"If the excerpt does NOT contain enough information, respond with exactly: NO_ANSWER"
    )

    async with httpx.AsyncClient(timeout=60.0) as http:
        resp = await http.post(
            f"{OLLAMA_BASE}/api/generate",
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
        )
        if resp.status_code == 200:
            text = resp.json().get("response", "").strip()
            print(f"  LLM response: {text[:200]}")
            if "NO_ANSWER" not in text.upper():
                answer = text
                if "ANSWER:" in text.upper():
                    answer = text.split(":", 1)[1].strip() if ":" in text else text
                print(f"  Found answer in batch {batch_label}!")
                return answer
    return None


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
    2. Search Wikipedia candidates for each entity.
    3. Use LLM to select the best candidate per entity.
    4. Fetch and condense each selected article.
    5. Merge all condensed articles into a prompt context and ask Ollama to answer.
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

        # STEP 2: Search Wikipedia candidates for each entity
        print("Searching Wikipedia candidates for each entity...")
        candidate_results = await asyncio.gather(
            *[search_wikipedia_candidates(entity) for entity in entities]
        )
        all_candidates = {}
        for entity, candidates in zip(entities, candidate_results):
            if candidates:
                all_candidates[entity] = candidates
                print(f"  {entity}: {[c['title'] for c in candidates]}")
            else:
                print(f"  {entity}: no results")

        if not all_candidates:
            msg = "Could not find Wikipedia candidates for any entity."
            print(msg)
            return msg

        # STEP 3: Use LLM to select best candidate per entity
        selected = await select_best_candidates(question, entities, all_candidates)
        if not selected:
            msg = "Could not select best candidates via LLM."
            print(msg)
            return msg

        print(f"Selected candidates: { {e: c['title'] for e, c in selected.items()} }")

        # STEP 4: Search articles paragraph by paragraph for the answer
        print("\n--- Searching articles for answer (5 paragraphs at a time) ---")
        all_answers = []
        all_summaries = []
        for entity, candidate in selected.items():
            result = await search_article_paragraphs(question, entity, candidate)
            if result["answer"]:
                all_answers.append(f"[{entity}] {result['answer']}")
            if result["summary"]:
                all_summaries.append(f"## {candidate['title']}\n{result['summary']}")
            if result["answer"]:
                print(f"\n*** Answer found for entity '{entity}' — stopping, not searching remaining entities. ***")
                break

        # Build final output
        output_parts = []
        if all_answers:
            output_parts.append(f"# Answer (via Ollama {CHAT_MODEL})\n" + "\n\n".join(all_answers))
        else:
            output_parts.append("Could not find an answer in any of the Wikipedia articles.")

        if all_summaries:
            output_parts.append("# Summaries\n" + "\n\n".join(all_summaries))

        final_output = "\n\n".join(output_parts)
        print(final_output)
        return final_output

    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        return error_msg


if __name__ == "__main__":
    query = "How is salted fish related to cancer?"
    result = asyncio.run(run(query))
    print(result)
