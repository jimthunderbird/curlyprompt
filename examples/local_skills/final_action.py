from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article
from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article
from skills.creative_story_writer import SKILL as skills_creative_story_writer

# Get top news from CNN
number_of_news = 1
top_news = skills_cnn_get_top_news.run(number_of_news)
news_url = top_news[0]['url']

# Summarize the news article
number_of_words = 200
summary = skills_cnn_summarize_news_article.run(news_url, number_of_words)

# Search Wikipedia for Fermat's Last Theorem
keyword = "Fermat's Last Theorem"
num_of_results = 1
wiki_result = skills_wikipedia_search.run(keyword, num_of_results)
wiki_article_url = wiki_result[0]['url']

# Read the Wikipedia article content
wiki_article_content = skills_wikipedia_read_article.run(wiki_article_url)

# Create a creative story combining the summary and Wikipedia content
word_limit = 100
new_story = skills_creative_story_writer.run(wiki_article_content, summary, word_limit)

print("news from cnn: " + summary + "\n")
print("new story: " + new_story + "\n")
