import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    keyword = "donald trump"
    question = "what is donald trump's birthday"
    num_of_results = 1
    save_to_file = None
    await skills_wikipedia_search.run(question, keyword, num_of_results, save_to_file)

asyncio.run(main())
