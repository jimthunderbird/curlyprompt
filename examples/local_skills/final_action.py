from skills.wikipedia.search import SKILL as skills_wikipedia_search

question = "what is donald trump's birthday"
keyword = "Donald Trump"
num_of_results = 1
results = skills_wikipedia_search.run(question, keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract']

# Save to file
with open("result.txt", mode="w", encoding="utf-8") as f:
    f.write(f"Title: {title}\n")
    f.write(f"URL: {url}\n")
    f.write(f"Extract: {extract}\n")
