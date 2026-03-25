from skills.wikipedia.search import SKILL as skills_wikipedia_search
import re

question = "what is Nikola Tesla, elon musk's birthday and birth place, also calculate their birth year difference, save to result.txt"
persons = ["Nikola Tesla", "elon musk"]
save_to_file = "result.txt"

# Empty the file first
with open(save_to_file, 'w', encoding='utf-8') as f:
    pass

results = []
for person in persons:
    keyword = person
    question = f"what is {person}'s birthday and birth place"
    num_of_results = 1
    try:
        skills_wikipedia_search.run(question, keyword, num_of_results, save_to_file)
    except Exception as e:
        print(f"Error fetching data for {person}: {e}")

# Read the file to calculate birth year difference
with open(save_to_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract birth years using regex
years = re.findall(r'(\d{4})', content)
if len(years) >= 2:
    diff = int(years[0]) - int(years[1])
    with open(save_to_file, 'a', encoding='utf-8') as f:
        f.write(f"\nBirth year difference: {diff} years")
