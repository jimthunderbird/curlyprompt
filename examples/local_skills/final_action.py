from skills.cnn.get_top_news import SKILL
from skills.cnn.summarize_news_article import SKILL as SUMMARIZE_SKILL

number_of_news = 5
top_news = SKILL.run(number_of_news)

for i, news in enumerate(top_news):
    article_url = news['url']
    summary = SUMMARIZE_SKILL.run(article_url, 30)
    print(f"News {i+1}:")
    print(f"Link: {article_url}")
    print(f"Summary: {summary}")
    print()
