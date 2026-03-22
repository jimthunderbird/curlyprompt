from skills.youtube.get_youtube_transcript import SKILL
import re

video_url = "https://www.youtube.com/shorts/Y83wbleLeUA"
transcript = SKILL.get_transcript(video_url, langs=None)

word_count_for_salt = len(re.findall(r'\bsalt\b', transcript.lower()))
word_count_for_sodium = len(re.findall(r'\bsodium\b', transcript.lower()))

output = {
    "transcript": transcript,
    "word_count_for_salt": word_count_for_salt,
    "word_count_for_sodium": word_count_for_sodium
}

print(output)
