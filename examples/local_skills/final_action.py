from skills.cnn.get_top_news import SKILL
from skills.cnn.summarize_news_article import SKILL as SUMMARIZE_SKILL
import json

# Get top 5 news
top_news = SKILL.run(5)

# Create list to store results
results = []

# Summarize each news article
for news in top_news:
    summary = SUMMARIZE_SKILL.run(news['url'], 40)
    results.append({
        "url": news['url'],
        "summary": summary
    })

# Save to file
with open('summary.json', 'w') as f:
    json.dump(results, f, indent=2)
