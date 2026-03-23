from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article
from skills.creative_story_writer import SKILL as skills_creative_story_writer

# Step 1: Search and summarize content_1 (Gutenberg)
keyword1 = "Gutenberg"
num_of_results = 1
results1 = skills_wikipedia_search.run(keyword1, keyword1, num_of_results)
url1 = results1[0]['url']
content1 = skills_wikipedia_read_article.run(url1)

# Step 2: Search and summarize content_2 (Guitar)
keyword2 = "Guitar"
num_of_results = 1
results2 = skills_wikipedia_search.run(keyword2, keyword2, num_of_results)
url2 = results2[0]['url']
content2 = skills_wikipedia_read_article.run(url2)

# Step 3: Search and summarize content_3 (Salt)
keyword3 = "Salt"
num_of_results = 1
results3 = skills_wikipedia_search.run(keyword3, keyword3, num_of_results)
url3 = results3[0]['url']
content3 = skills_wikipedia_read_article.run(url3)

# Step 4: Write a creative story using the three contents
skills_creative_story_writer.run(content1, content2, content3, 20, "simple english")
