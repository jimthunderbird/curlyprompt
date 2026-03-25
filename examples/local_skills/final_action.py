from skills.wikipedia.search import SKILL as skills_wikipedia_search

question = "what is donald trump's birthday"
keyword = "Donald Trump"
num_of_results = 1
save_to_file = "result1.txt"

results = skills_wikipedia_search.run(question, keyword, num_of_results, save_to_file)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract']

# Read file content from url
with open(save_to_file, 'r') as f:
    content = f.read()

# Construct prompt
prompt = f"forget about your previous knowledge, based only on the following facts, answer the question: {question}\nfacts {{\n{content}\n}}"

# Send prompt to ollama model gemma3:latest with streaming
