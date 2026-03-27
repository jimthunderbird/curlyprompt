import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "how is tesla related to nvidia"
    await skills_wikipedia_search.run(question)

asyncio.run(main())
