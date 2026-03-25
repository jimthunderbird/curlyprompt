from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article

# Get top 4 news articles
number_of_news = 4
top_news = skills_cnn_get_top_news.run(number_of_news)

# Get the URL of the 4th news article
fourth_news_url = top_news[3]['url']

# Summarize the 4th news article with 50 words
number_of_words = 50
news_article_summary = skills_cnn_summarize_news_article.run(fourth_news_url, number_of_words)

print("URL of 4th news:", fourth_news_url)
print("Summary of 4th news:", news_article_summary)
