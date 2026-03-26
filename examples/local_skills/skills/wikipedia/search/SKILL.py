import urllib.parse
import json
import aiohttp
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import Counter

async def search(keyword, num_of_results=1):
    """
    Searches Wikipedia for a keyword and returns page summaries.
    :param keyword: The search term to look up on Wikipedia.
    :param num_of_results: Number of results to return.
    """
    try:
        headers = {'User-Agent': 'CurlyPromptBot/1.0 (https://github.com/curlyprompt; curlyprompt@example.com)'}

        # Search for matching titles using opensearch
        search_params = urllib.parse.urlencode({
            'action': 'opensearch',
            'search': keyword,
            'limit': num_of_results,
            'format': 'json'
        })
        search_url = f"https://en.wikipedia.org/w/api.php?{search_params}"
        async with aiohttp.ClientSession() as session:
            async with session.get(search_url, headers=headers) as response:
                data = await response.json(content_type=None)

        titles = data[1] if len(data) > 1 else []
        if not titles:
            return []

        # Fetch extracts using titles query as described in SKILL.md
        extract_params = urllib.parse.urlencode({
            'action': 'query',
            'titles': '|'.join(titles),
            'prop': 'extracts',
            'exintro': True,
            'explaintext': True,
            'format': 'json'
        })
        extract_url = f"https://en.wikipedia.org/w/api.php?{extract_params}"
        async with aiohttp.ClientSession() as session:
            async with session.get(extract_url, headers=headers) as response:
                data = await response.json(content_type=None)

        pages = data.get('query', {}).get('pages', {})
        results = []
        for page_id, page in pages.items():
            if page_id == '-1':
                continue
            title = page.get('title', '')
            results.append({
                'title': title,
                'url': f"https://en.wikipedia.org/?curid={page_id}",
                'extract': page.get('extract', '')
            })

        return results

    except Exception as e:
        print(f"Error searching Wikipedia: {e}")
        return []


async def run(question, keyword, num_of_results=1, save_to_file=None):
    """
    Main entry point that implements the full SKILL.md logic.
    - If question starts with what/when/how/who: search Wikipedia, read full content,
      construct a fact-based prompt, and send to ollama gemma3:latest with streaming.
    - Otherwise: just return search results (title, url, extract).
    - If save_to_file is provided, the ollama response is saved to that file.
    """
    results = await search(keyword, num_of_results)
    if not results:
        print("No Wikipedia results found.")
        return results

    # Read full content from the first result's URL
    content = await read_content_from_url(results[0]['url'])

    # Construct the prompt
    prompt = (
        f"forget about your previous knowledge, based only on the following facts, "
        f"extract the most related data to answer the following question: {question}\n"
        f"facts {{\n"
        f"  {content}\n"
        f"}}"
    )

    # Send to ollama with streaming and wait for the result
    ollama_result = await send_to_ollama(prompt)

    # Save the result to file if save_to_file is specified
    if save_to_file and ollama_result:
        import aiofiles
        async with aiofiles.open(save_to_file, 'a', encoding='utf-8') as f:
            await f.write(ollama_result)
        print(f"Result saved to {save_to_file}")

async def read_content_from_url(url):
    """
    Reads the plain text content from a Wikipedia page URL.
    """
    try:
        # Extract page title or curid from the URL and use the API to get full text
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qs(parsed.query)

        query_params = {
            'action': 'query',
            'prop': 'extracts',
            'explaintext': True,
            'format': 'json'
        }

        if 'curid' in params:
            query_params['pageids'] = params['curid'][0]
        elif 'title' in params:
            query_params['titles'] = params['title'][0]
        else:
            # Try to get title from path
            path = parsed.path
            if '/wiki/' in path:
                title = path.split('/wiki/')[-1]
                query_params['titles'] = urllib.parse.unquote(title)
            else:
                return ''

        api_url = f"https://en.wikipedia.org/w/api.php?{urllib.parse.urlencode(query_params)}"
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url, headers={'User-Agent': 'CurlyPromptBot/1.0 (https://github.com/curlyprompt; curlyprompt@example.com)'}) as response:
                data = await response.json(content_type=None)

        pages = data.get('query', {}).get('pages', {})
        for page_id, page in pages.items():
            if page_id == '-1':
                continue
            return page.get('extract', '')

        return ''

    except Exception as e:
        print(f"Error reading content from URL: {e}")
        return ''


async def send_to_ollama(prompt, model="qwen3-coder:30b"):
    """
    Sends a prompt to ollama and streams the response.
    """
    try:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": True
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://localhost:11434/api/generate",
                json=payload
            ) as response:
                full_response = ""
                async for line in response.content:
                    chunk = json.loads(line.decode('utf-8'))
                    token = chunk.get('response', '')
                    if token:
                        print(token, end='', flush=True)
                        full_response += token
                    if chunk.get('done', False):
                        break
                print()  # newline after streaming
                return full_response

    except Exception as e:
        print(f"Error communicating with ollama: {e}")
        return ''


def summarize_paragraph(paragraph, num_words=10):
    """
    Summarizes a paragraph by extracting the most important sentences
    that fit within the target word count, using nltk frequency-based
    extractive summarization.
    """
    sentences = sent_tokenize(paragraph)
    if not sentences:
        return ''

    # If the paragraph is already short enough, return as-is
    words = word_tokenize(paragraph)
    if len(words) <= num_words:
        return paragraph

    # Score sentences by word frequency (excluding stopwords)
    stop_words = set(stopwords.words('english'))
    word_freq = Counter(
        w.lower() for w in word_tokenize(paragraph)
        if w.isalnum() and w.lower() not in stop_words
    )

    sentence_scores = []
    for sent in sentences:
        score = sum(word_freq.get(w.lower(), 0) for w in word_tokenize(sent) if w.isalnum())
        sentence_scores.append((score, sent))

    # Pick the top-scoring sentence(s) up to num_words
    sentence_scores.sort(key=lambda x: x[0], reverse=True)
    summary_words = []
    for _, sent in sentence_scores:
        sent_words = word_tokenize(sent)
        if len(summary_words) + len(sent_words) <= num_words:
            summary_words.extend(sent_words)
        else:
            # Take partial words from this sentence to fill remaining budget
            remaining = num_words - len(summary_words)
            if remaining > 0 and not summary_words:
                summary_words.extend(sent_words[:remaining])
            break

    return ' '.join(summary_words) if summary_words else ' '.join(word_tokenize(sentences[0])[:num_words])


def summarize_article(article_content):
    """
    Splits article content into paragraphs, counts words in each paragraph,
    and summarizes each to approximately half its word count using nltk.
    """
    paragraphs = [p.strip() for p in article_content.split('\n') if p.strip()]
    article_summary = []
    for paragraph in paragraphs:
        num_of_words_in_paragraph = len(word_tokenize(paragraph))
        num_of_words_in_paragraph_summary = max(1, num_of_words_in_paragraph // 2)
        paragraph_summary = summarize_paragraph(paragraph, num_words=num_of_words_in_paragraph_summary)
        if paragraph_summary:
            article_summary.append(paragraph_summary)
    return '\n'.join(article_summary)


def _ensure_nltk_data():
    """Download required nltk data if not already present."""
    for resource in ['punkt_tab', 'stopwords']:
        try:
            nltk.data.find(f'tokenizers/{resource}' if 'punkt' in resource else f'corpora/{resource}')
        except LookupError:
            nltk.download(resource, quiet=True)


async def run_related(question, entities):
    """
    Handles questions involving multiple entities where the user wants to know
    how they are related. For each entity, fetches the Wikipedia content,
    summarizes each paragraph to 10 words using nltk, then combines all
    summarized facts and asks a single relationship question.
    """
    _ensure_nltk_data()

    all_facts = {}
    for entity in entities:
        results = await search(entity, 1)
        if not results:
            print(f"No Wikipedia results found for '{entity}', skipping.")
            continue

        content = await read_content_from_url(results[0]['url'])
        if not content:
            print(f"No content found for '{entity}', skipping.")
            continue

        # Summarize each paragraph to 10 words and merge
        summarized_content = summarize_article(content)
        all_facts[entity] = summarized_content
        print(f"Fetched and summarized content for '{entity}'")

    if not all_facts:
        print("No content collected for any entity.")
        return

    # Combine all facts and ask a single relationship question
    facts_block = "\n\n".join(
        f"--- {entity} ---\n{content}" for entity, content in all_facts.items()
    )
    entity_names = ", ".join(all_facts.keys())
    prompt = (
        f"forget about your previous knowledge, based only on the following facts, "
        f"answer the following question: {question}\n"
        f"Are all these entities related: {entity_names}? If so, how?\n"
        f"facts {{\n"
        f"  {facts_block}\n"
        f"}}"
    )

    await send_to_ollama(prompt)


def is_question(text):
    """
    Checks if the user's question starts with what, when, how, or who.
    """
    lower = text.strip().lower()
    result = lower.startswith(("what", "when", "how", "who"))
    if (result is False):
        print("this is not a question")
    return result


