from skills.cnn.get_top_news import SKILL
from skills.cnn.summarize_news_article import SKILL as SUMMARIZE_SKILL
import json

# Get top 5 news
top_news = SKILL.run(5)

# Create array of JSON objects with url and summary
results = []
for news in top_news:
    url = news['url']
    summary = SUMMARIZE_SKILL.run(url, 10)
    results.append({
        'url': url,
        'summary': summary
    })

# Save to summary.json
with open('summary.json', 'w') as f:
    json.dump(results, f)
