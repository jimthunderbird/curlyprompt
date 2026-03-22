from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article
from skills.wikipedia.search import SKILL as skills_wikipedia_search

# Get top 5 news from CNN
top_news = skills_cnn_get_top_news.run(5)

# Create array of JSON with URL and 10-word summary
results = []
for news in top_news:
    summary = skills_cnn_summarize_news_article.run(news['url'], 10)
    results.append({
        'url': news['url'],
        'summary': summary
    })

# Search Wikipedia for Fermat's Last Theorem
wiki_result = skills_wikipedia_search.run("Fermat's Last Theorem", 1)
wiki_page_link = wiki_result[0]['url']

print(results)
print(wiki_page_link)
