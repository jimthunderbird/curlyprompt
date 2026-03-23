from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article
from skills.creative_story_writer import SKILL as skills_creative_story_writer

# Step 1: Search and summarize Gutenberg
keyword1 = "Gutenberg"
results1 = skills_wikipedia_search.run(keyword1, keyword1, 1)
url1 = results1[0]['url']
content1 = skills_wikipedia_read_article.run(url1)
summary1 = content1[:50] + "..." if len(content1) > 50 else content1

# Step 2: Search and summarize Guitar
keyword2 = "Guitar"
results2 = skills_wikipedia_search.run(keyword2, keyword2, 1)
url2 = results2[0]['url']
content2 = skills_wikipedia_read_article.run(url2)
summary2 = content2[:50] + "..." if len(content2) > 50 else content2

# Step 3: Search and summarize Salt
keyword3 = "Salt"
results3 = skills_wikipedia_search.run(keyword3, keyword3, 1)
url3 = results3[0]['url']
content3 = skills_wikipedia_read_article.run(url3)
summary3 = content3[:50] + "..." if len(content3) > 50 else content3

# Step 4: Generate creative story
story = skills_creative_story_writer.run(summary1, summary2, 100)
story = skills_creative_story_writer.run(story, summary3, 100)

print(story)
