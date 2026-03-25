from skills.wikipedia.search import SKILL as skills_wikipedia_search

persons = ["james cameron", "leopold aschenbrenner"]
save_to_file = "result.txt"

# empty the file first
with open(save_to_file, 'w', encoding='utf-8') as f:
    pass  # 'pass' does nothing, resulting in an empty file

results = []
for person in persons:
    keyword = person
    question = f"what is {person}'s birthday"
    num_of_results = 1
    try:
        # Run the skill for each person
        skills_wikipedia_search.run(question, keyword, num_of_results, save_to_file)
    except Exception as e:
        print(f"Error fetching data for {person}: {e}")
