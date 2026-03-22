from skills.cnn.get_top_news import SKILL as news_skill
from skills.cnn.summarize_news_article import SKILL as summary_skill
import json

# Get top 5 news
top_news = news_skill.run(5)

# Create array of JSON objects with url and summary
result = []
for news in top_news:
    url = news['url']
    summary = summary_skill.run(url, 10)
    result.append({
        'url': url,
        'summary': summary
    })

# Save to file
with open('summary.json', 'w') as f:
    json.dump(result, f, indent=2)
