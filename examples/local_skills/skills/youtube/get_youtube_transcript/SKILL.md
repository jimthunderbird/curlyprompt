# SKILL: Get YouTube Transcript

## Context Mapping
- get youtube transcript: use yt-dlp to extract subtitles from a YouTube video URL, download the subtitle content, and print the transcript text

## The Script And Usage

```python
from skills.youtube.get_youtube_transcript import SKILL
transcript = SKILL.run(video_url, langs=None)
