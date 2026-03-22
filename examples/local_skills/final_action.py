from skills.cnn.get_top_news import SKILL
from skills.cnn.summarize_news_article import SKILL as SUMMARIZE_SKILL
import json

# Get top 5 news
number_of_news = 5
top_news = SKILL.run(number_of_news)

# Create summaries for each news
results = []
for news in top_news:
    try:
        summary = SUMMARIZE_SKILL.run(news['url'], 10)
        results.append({
            "url": news['url'],
            "summary": summary
        })
    except:
        # If summarization fails, add basic info
        results.append({
            "url": news['url'],
            "summary": "Summary not available"
        })

# Save to file
with open('summary.json', 'w') as f:
    json.dump(results, f, indent=2)
