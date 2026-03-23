from skills.wikipedia.search import SKILL as skills_wikipedia_search

keyword = "current president of united states"
num_of_results = 1
results = skills_wikipedia_search.run(keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract']

print(f"Title: {title}")
print(f"URL: {url}")
print(f"Summary: {extract}")
