from skills.wikipedia.search import SKILL as skills_wikipedia_search

# List of persons
persons = ["obama", "warren buffett", "donald trump"]

# Prepare to save results
results = []

# Loop through each person and ask one question for each
for person in persons:
    question = f"What is {person}'s birthday and birth place?"
    keyword = person  # Use the person's name as keyword
    num_of_results = 1
    save_to_file = "result3.txt"
    
    # Run the search skill
    skills_wikipedia_search.run(question, keyword, num_of_results, save_to_file)
    
    # Read result from file and store it
    with open(save_to_file, 'r', encoding='utf-8') as f:
        result = f.read().strip()
        results.append(f"{person}: {result}")

# Save all results to the file
with open("result3.txt", "w", encoding="utf-8") as f:
    for res in results:
        f.write(res + "\n")
