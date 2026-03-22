import SKILL

# Show top 10 news in CNN with summary
print("Top 10 CNN News:")
cnn_news = SKILL.main({"n": 10})
for i, news in enumerate(cnn_news, 1):
    print(f"{i}. {news}")

# Show latest release in Project Gutenberg
print("\nLatest Project Gutenberg Release:")
gutenberg_release = SKILL.main({"type": "gutenberg"})
print(gutenberg_release)
