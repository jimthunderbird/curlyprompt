from skills.cnn.get_top_news import SKILL
number_of_news = 3
top_news = SKILL.run(number_of_news)
for news in top_news:
    print({"url": news['url']})
