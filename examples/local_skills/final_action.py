import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "who is the current president in the united states"
    await skills_wikipedia_search.run(question)

asyncio.run(main())
