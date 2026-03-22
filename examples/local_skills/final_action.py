from skills.wikipedia.search import SKILL
keyword = "Fermat's Last Theorem"
num_of_results = 1
result = SKILL.run(keyword, num_of_results)
print(result[0]['url'])
