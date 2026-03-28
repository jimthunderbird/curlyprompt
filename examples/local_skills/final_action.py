import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "salted fish nasophary cancer relationship"
    result = await skills_wikipedia_search.run(question)
    print(result)

asyncio.run(main())
