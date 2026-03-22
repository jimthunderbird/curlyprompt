from skills.cnn.get_top_news import SKILL
number_of_news = 3
top_news = SKILL.run(number_of_news)
for i, news in enumerate(top_news):
    print(f"{i+1}. {news['url']}")
