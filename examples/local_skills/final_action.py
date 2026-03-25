from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.research.find_answer_for_question_from_files import SKILL as skills_research_find_answer_for_question_from_files

# Define entities
entities = ["Tesla, Inc", "Rivian", "Ford Motor Company"]
question = "are they competitors?"

# Step 1: Search Wikipedia for each entity and save findings
for entity in entities:
    keyword = entity
    question_entity = f"What is {entity}"
    num_of_results = 1
    save_to_file = f"{entity.replace(', ', '_').replace(' ', '_')}_findings.txt"
    
    # Empty the file first
    with open(save_to_file, 'w', encoding='utf-8') as f:
        pass  # 'pass' does nothing, resulting in an empty file
    
    # Run the skill to search and save findings
    skills_wikipedia_search.run(question_entity, keyword, num_of_results, save_to_file)

# Step 2: Use the saved findings to answer the question
file_paths = [f"{entity.replace(', ', '_').replace(' ', '_')}_findings.txt" for entity in entities]
skills_research_find_answer_for_question_from_files.run(question, *file_paths)
