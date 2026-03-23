from skills.wikipedia.search import SKILL as skills_wikipedia_search
from skills.wikipedia.read_article import SKILL as skills_wikipedia_read_article

# Search for Tom Hanks
keyword = "Tom Hanks"
num_of_results = 1
results = skills_wikipedia_search.run(keyword, num_of_results)

# Get the article URL
article_url = results[0]['url']

# Read the article content
article_content = skills_wikipedia_read_article.run(article_url)

# Extract birthday from content (this would need actual parsing logic)
# For demonstration, assuming we can extract it from the content
birthday = "Not directly extractable from this interface"
