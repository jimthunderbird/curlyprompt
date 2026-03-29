import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "what is the population of Corte_Madera,_California"
    result = await skills_wikipedia_search.run(question)
    print(result)

asyncio.run(main())
