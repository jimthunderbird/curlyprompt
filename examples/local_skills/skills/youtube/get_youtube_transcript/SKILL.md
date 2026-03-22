# SKILL: Get YouTube Transcript

## Context Mapping
- get youtube transcript: use yt-dlp to extract subtitles from a YouTube video URL, download the subtitle content, and print the transcript text

## The Script

```python
from skills.youtube.get_youtube_transcript import SKILL
print SKILL.get_transcript(video_url, langs=None):
