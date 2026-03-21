# SKILL.md: Gutenberg to Simple English Translator (Streaming Append)

## Description
This skill reads a Project Gutenberg book by its ID and uses a local Ollama instance running `gemma3:latest` to translate the text into Simple English. To prevent data loss during long processing times, each translated chunk is appended to the output file immediately upon completion.

## Configuration
- **Model:** `gemma3:latest`
- **Source:** Project Gutenberg (via ID)
- **Output:** `{book_id}_simple.md` (Incremental writing)

## Workflow

### 1. Initialization
- User provides a `BOOK_ID`.
- Create/Overwrite a file named `{BOOK_ID}_simple.md` with an initial header containing the book ID and a "Simplified by AI" disclaimer.

### 2. Retrieval & Preparation
- Fetch the raw text from: `https://www.gutenberg.org/cache/epub/{BOOK_ID}/pg{BOOK_ID}.txt`
- Clean the text by removing the Gutenberg headers and footers.
- Split the text into logical chunks (e.g., by chapter or 2,000-word blocks).

### 3. Incremental Translation & Writing
- **Loop through chunks:**
    1. Send Chunk $n$ to `gemma3:latest`.
    2. **System Instruction:** *"Rewrite the following text in very simple English. Use common vocabulary and short sentences. Maintain the original story's meaning."*
    3. **Immediate Write:** Open `{BOOK_ID}_simple.md` in **append mode (`a`)** and write the resulting translation immediately.
    4. **Terminal Update:** Display a progress bar and a status message: `[Chunk n/Total] Written to file...`
    5. **Buffer Clear:** Ensure the file buffer is flushed to disk to prevent data loss if the process is interrupted.

### 4. Finalization
- Close the file handle.
- **Terminal Output:** Display a summary including total chunks processed and the final file path.

---

## Implementation Example (Python Logic)

```python
import requests
from tqdm import tqdm
from ollama import generate

def translate_and_append(book_id):
    filename = f"{book_id}_simple.md"
    
    # 1. Fetch and Clean
    print(f"Fetching Book ID {book_id}...")
    raw_data = requests.get(f"[https://www.gutenberg.org/cache/epub/](https://www.gutenberg.org/cache/epub/){book_id}/pg{book_id}.txt").text
    content = raw_data.split("*** START")[1].split("*** END")[0]
    chunks = [content[i:i+4000] for i in range(0, len(content), 4000)]
    
    # 2. Initialize File
    with open(filename, "w") as f:
        f.write(f"# Simplified Version of Gutenberg Book {book_id}\n\n")

    # 3. Process & Append Immediately
    print(f"Starting translation of {len(chunks)} chunks...")
    for i, chunk in enumerate(tqdm(chunks, desc="Progress", unit="chunk")):
        response = generate(
            model='gemma3:latest',
            prompt=f"Rewrite this using very simple English words, no explanation, no extra words, no summary on what you did:\n\n{chunk}"
        )
        
        # Append right away so we don't lose data if it crashes
        with open(filename, "a", encoding="utf-8") as f:
            f.write(response['response'] + "\n\n")
            f.flush() # Force write to disk

    print(f"\nDone! View your book in {filename}")

translate_and_append(11)
