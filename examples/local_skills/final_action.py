from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article

question = "Who is Mark Zuckerberg"
keyword = "Mark Zuckerberg"
num_of_results = 1
results = skills_wikipedia_search.run(question, keyword, num_of_results)
title = results[0]['title']
url = results[0]['url']
extract = results[0]['extract']

article_content = skills_wikipedia_read_article.run(url)

from skills.creative_story_writer import SKILL as skills_creative_story_writer
content_1 = article_content
content_2 = "He is known for creating a social media platform"
content_3 = "His story is one of ambition and innovation"
word_limit = 100
constraint = "use shakespear tone"
skills_creative_story_writer.run({content_1}, {content_2}, {content_3}, word_limit, constraint)
