# Skill: Fetch AI Top News

## Description
This skill fetches the latest AI news headlines using Claude's WebFetch tool. It retrieves the top N articles with their titles, links, and excerpts.

## Instructions
Use the WebFetch tool to fetch AI news articles. Try sources in order until one succeeds:

### Source 1 (Primary): TechCrunch AI RSS Feed
1. Call WebFetch with:
   - **URL:** `https://techcrunch.com/category/artificial-intelligence/feed/`
   - **Prompt:** `List the top {N} news articles from this RSS feed. For each article, provide: 1) the title, 2) the full URL link, 3) a brief excerpt or summary. Format each as a numbered list.`

### Source 2 (Fallback): Ars Technica AI
1. If Source 1 fails, call WebFetch with:
   - **URL:** `https://arstechnica.com/ai/`
   - **Prompt:** `List the top {N} news articles. For each article, provide: 1) the title, 2) the full URL link, 3) a brief excerpt or summary. Format each as a numbered list.`

### Source 3 (Fallback): VentureBeat AI
1. If Source 2 also fails, call WebFetch with:
   - **URL:** `https://venturebeat.com/category/ai/`
   - **Prompt:** `List the top {N} news articles. For each article, provide: 1) the title, 2) the full URL link, 3) a brief excerpt or summary. Format each as a numbered list.`

2. Display the results to the user in this format:
```
--- AI Top {N} News ---
1. {title}
   Link: {url}
   {excerpt}
```

Replace `{N}` with the number of articles requested (default: 5).
