from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article
from skills.creative_story_writer import SKILL as skills_creative_story_writer

# Step 1: Search and get summaries
keyword1 = "Gutenberg"
keyword2 = "Guitar"
keyword3 = "Salt"

num_of_results = 1
results1 = skills_wikipedia_search.run(keyword1, keyword1, num_of_results)
results2 = skills_wikipedia_search.run(keyword2, keyword2, num_of_results)
results3 = skills_wikipedia_search.run(keyword3, keyword3, num_of_results)

url1 = results1[0]['url']
url2 = results2[0]['url']
url3 = results3[0]['url']

# Step 2: Read article contents
content1 = skills_wikipedia_read_article.run(url1)
content2 = skills_wikipedia_read_article.run(url2)
content3 = skills_wikipedia_read_article.run(url3)

# Step 3: Create story with constraints
word_limit = 20
constraint = "use very very simple english"
result = skills_creative_story_writer.run(content1, content2, content3, word_limit, constraint)
print(result)
