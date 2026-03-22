from skills.youtube.get_youtube_transcript import SKILL
import urllib.request
import re

# Get YouTube transcript
video_url = "https://www.youtube.com/shorts/_vE9m2aYESU"
transcript = SKILL.get_transcript(video_url, langs=None)

# Count occurrences of "salt" and "sodium"
word_count_for_salt = transcript.lower().count("salt")
word_count_for_sodium = transcript.lower().count("sodium")

# Fetch top CNN news
def fetch_cnn_lite_news(n=1):
    base_url = "https://lite.cnn.com"
    
    try:
        req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        pattern = r'<a href="(/20\d{2}[^"]*)">([^<]+)</a>'
        matches = re.findall(pattern, html)
        
        news_items = []
        for link, title in matches[:n]:
            news_items.append({
                "title": title.strip(),
                "url": f"{base_url}{link}"
            })
            
        return news_items
        
    except urllib.error.URLError as e:
        print(f"Network error while fetching news: {e}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

top_one_news = fetch_cnn_lite_news(1)[0]

# Output JSON
output = {
    "transcript": transcript,
    "word_count_for_salt": word_count_for_salt,
    "word_count_for_sodium": word_count_for_sodium,
    "top_cnn_news_url": top_one_news["url"]
}

print(output)
