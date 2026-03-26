import asyncio
from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.research.find_answer_for_question_from_files import SKILL as skills_research_find_answer_for_question_from_files

async def main():
    entities = ["salt", "sugar", "salted fish", "cancer"]
    save_to_file = "result.txt"
    
    # Empty the file first
    with open(save_to_file, 'w', encoding='utf-8') as f:
        pass

    # Search each entity and save findings to individual files
    for entity in entities:
        keyword = entity
        question = f"What is {entity}?"
        num_of_results = 1
        file_name = f"{entity.replace(' ', '_')}_findings.txt"
        await skills_wikipedia_search.run(question, keyword, num_of_results, file_name)

    # Now answer if they are related
    question = "Are salt, sugar, salted fish, and cancer related?"
    files = [f"{entity.replace(' ', '_')}_findings.txt" for entity in entities]
    await skills_research_find_answer_for_question_from_files.run(question, *files)

asyncio.run(main())
