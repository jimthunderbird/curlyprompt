import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search

async def main():
    question = "how are sugar, salt, salted fish, and cancer related?"
    entities = ["sugar", "salt", "salted fish", "cancer"]
    await skills_wikipedia_search.run_related(question, entities)

asyncio.run(main())
