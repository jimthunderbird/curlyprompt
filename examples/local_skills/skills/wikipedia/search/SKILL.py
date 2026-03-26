import urllib.parse
import json
import aiohttp

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


async def run_related(question, entities):
    """
    Handles questions involving multiple entities where the user wants to know
    how they are related. For each entity, fetches the Wikipedia content URL
    and reads its content. Then combines all facts and asks a single question
    about whether the entities are related.
    """
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

        all_facts[entity] = content
        print(f"Fetched content for '{entity}'")

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


