import yt_dlp
import sys
import requests

def run(video_url, langs=None):
    """
    Extracts transcript/subtitles from a YouTube video.
    langs: list of language codes in priority order (default: English)
    """
    if langs is None:
        langs = ['en', 'en-US', 'en-GB']

    ydl_opts = {
        'skip_download': True,
        'writeautomaticsub': True,
        'writesubs': True,
        'subtitleslangs': langs,
        'subtitlesformat': 'json3',
        'quiet': True,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        subtitles = info.get('requested_subtitles')

        if not subtitles:
            print("No subtitles found for the requested languages.")
            return

        lang_used = list(subtitles.keys())[0]
        sub_url = subtitles[lang_used]['url']

        resp = requests.get(sub_url)
        resp.raise_for_status()
        data = resp.json()

        lines = []
        for event in data.get('events', []):
            segs = event.get('segs', [])
            text = ''.join(s.get('utf8', '') for s in segs).strip()
            if text and text != '\n':
                lines.append(text)

        return '\n'.join(lines)
