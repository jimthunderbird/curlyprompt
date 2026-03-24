from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article

# Get top news
number_of_news = 1
top_news = skills_cnn_get_top_news.run(number_of_news)
article_url = top_news[0]['url']

# Summarize article
number_of_words = 50
news_article_summary = skills_cnn_summarize_news_article.run(article_url, number_of_words)

# Convert to simple words
simple_words_summary = news_article_summary.replace("important", "big").replace("people", "persons").replace("said", "told").replace("new", "fresh").replace("time", "hour").replace("way", "method").replace("help", "assist").replace("find", "discover").replace("work", "job").replace("life", "living")

print("-----------------------------------")
print(news_article_summary)
print(simple_words_summary)
print("-----------------------------------")
