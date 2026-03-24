from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article

# Get top 3 news articles
number_of_news = 3
top_news = skills_cnn_get_top_news.run(number_of_news)

# Filter news related to Iran and summarize
filtered_news = []
for article in top_news:
    if 'iran' in article['title'].lower():
        try:
            summary = skills_cnn_summarize_news_article.run(article['url'], 50)
            filtered_news.append({
                'title': article['title'],
                'url': article['url'],
                'summary': summary
            })
            if len(filtered_news) >= 3:
                break
        except:
            continue

# Display results
for i, news in enumerate(filtered_news, 1):
    print(f"News {i}:")
    print(f"Title: {news['title']}")
    print(f"URL: {news['url']}")
    print(f"Summary: {news['summary']}")
    print()
