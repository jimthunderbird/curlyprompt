from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article
from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article

# Get top news from CNN
number_of_news = 1
top_news = skills_cnn_get_top_news.run(number_of_news)

# Summarize each news article
summaries = []
for news in top_news:
    summary = skills_cnn_summarize_news_article.run(news['url'], 10)
    summaries.append({
        'url': news['url'],
        'summary': summary
    })

# Search Wikipedia for Fermat's Last Theorem
keyword = "Fermat's Last Theorem"
num_of_results = 1
wiki_search_result = skills_wikipedia_search.run(keyword, num_of_results)

# Get the Wikipedia article content
article_url = wiki_search_result[0]['url']
article_content = skills_wikipedia_read_article.run(article_url)

# Output results
print(summaries)
print({
    'url': article_url,
    'content': article_content
})
