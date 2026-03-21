# Project Gutenberg Search Skill

## Description
This skill searches the Project Gutenberg book index by parsing the raw `GUTINDEX.ALL` file directly — no external model or API required.

---

## Data Source
* **URL:** `https://www.gutenberg.org/dirs/GUTINDEX.ALL`

---

## Implementation Steps

### 1. Fetch the index
Use the WebFetch tool to read the content from `https://www.gutenberg.org/dirs/GUTINDEX.ALL`.

### 2. Split content into lines
Split the fetched content by newlines (`\n`) to get an array of lines.

### 3. Parse each line into title and ID
For each line:
1. **Trim** the line (remove leading/trailing whitespace).
2. If the trimmed line is an **empty string**, **skip it**.
3. If non-empty, **split the line into exactly 2 parts** by the **last occurrence** of two-or-more consecutive spaces (`  +`). This gives:
   - **Part A** (trimmed) → the **book title** (and any author/metadata)
   - **Part B** (trimmed) → the **book ID**. Extract only the numeric portion (strip any non-digit characters such as letters or suffixes like "C").
4. If the line cannot be split into two parts this way, or Part B contains no digits, skip it.

### 4. Search and present results
Given the user's search keyword:
1. Filter entries where Part A (book title) contains the keyword (case-insensitive).
2. For each match, present:
   - **Title:** Part A
   - **ID:** Part B
   - **Link:** `https://www.gutenberg.org/cache/epub/{ID}/pg{ID}.txt`
3. Return results as a Markdown table:

| Title | ID | Link |
|---|---|---|
| The Adventures of Sherlock Holmes, by Arthur Conan Doyle | 1661 | https://www.gutenberg.org/cache/epub/1661/pg1661.txt |
