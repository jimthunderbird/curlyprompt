from skills.cnn.get_top_news import SKILL as get_top_news_skill
from skills.cnn.summarize_news_article import SKILL as summarize_news_article_skill
import json

# Get top 5 news
top_news = get_top_news_skill.run(5)

# Create summary for each news
summaries = []
for news in top_news:
    url = news['url']
    summary = summarize_news_article_skill.run(url, 10)
    summaries.append({
        "url": url,
        "summary": summary
    })

# Save to file
with open('summary.json', 'w') as f:
    json.dump(summaries, f)
