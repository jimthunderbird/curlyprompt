from skills.youtube.get_youtube_transcript import SKILL

video_url = "https://www.youtube.com/shorts/Y83wbleLeUA"
transcript = SKILL.get_transcript(video_url, langs=None)
print(transcript)

salt_count = transcript.lower().count("salt")
print(f"The word 'salt' appears {salt_count} times")
