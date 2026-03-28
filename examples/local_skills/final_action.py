import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "is the novel time machine and artificial intelligence related"
    result = await skills_wikipedia_search.run(question)
    print(result)

asyncio.run(main())
