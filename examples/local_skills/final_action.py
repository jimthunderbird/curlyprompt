import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "are they related?"
    entities = ["salt", "sugar", "salted fish", "cancer"]
    await skills_wikipedia_search.run_related(question, entities)

asyncio.run(main())
