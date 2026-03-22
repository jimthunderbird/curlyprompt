from skills.cnn.get_top_news import SKILL as skills_cnn_get_top_news
from skills.cnn.summarize_news_article import SKILL as skills_cnn_summarize_news_article
from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article

# Get top news from CNN
top_news = skills_cnn_get_top_news.run(1)
news_list = []

for news in top_news:
    summary = skills_cnn_summarize_news_article.run(news['url'], 10)
    news_list.append({
        'url': news['url'],
        'summary': summary
    })

print(news_list)

# Search Wikipedia for Fermat's Last Theorem
search_result = skills_wikipedia_search.run("Fermat's Last Theorem", 1)
wiki_url = search_result[0]['url']

# Read the article content
article_content = skills_wikipedia_read_article.run(wiki_url)

print(f"Wiki Page Link: {wiki_url}")
print(f"Content: {article_content}")
