import requests
from bs4 import BeautifulSoup
import ollama

def run(url, num_of_words=100):
    """
    Reads a CNN Lite article and summarizes it using Ollama.
    :param url: The CNN Lite URL to scrape.
    :param num_of_words: The target word count for the summary.
    """
    try:
        # 1. Fetch the webpage content
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # 2. Parse the HTML (CNN Lite structure)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title (h2) and all paragraph text
        title = soup.find('h2').get_text(strip=True) if soup.find('h2') else "No Title Found"
        paragraphs = soup.find_all('p')
        article_text = "\n".join([p.get_text(strip=True) for p in paragraphs])
        
        if not article_text.strip():
            return "Error: No article content could be extracted."

        # 3. Prepare the prompt for Gemma 3
        prompt = (
            f"Summarize the following news article in approximately {num_of_words} words. "
            f"Focus on the key events and figures mentioned.\n\n"
            f"No Explanation. No Extra Word.\n\n"
            f"Title: {title}\n"
            f"Content: {article_text}"
        )

        # 4. Request summary from local Ollama instance
        print(f"Requesting a {num_of_words}-word summary from Gemma 3...")
        
        response = ollama.chat(
            model='gemma3:latest', 
            messages=[{'role': 'user', 'content': prompt}]
        )

        return response['message']['content']

    except requests.exceptions.RequestException as e:
        return f"Network error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

# Example Usage
if __name__ == "__main__":
    cnn_url = "https://lite.cnn.com/2026/03/22/politics/homan-ice-security-airports"
    
    # Example 1: Default (100 words)
    print("--- 100 WORD SUMMARY ---")
    print(run(cnn_url))
    
    # Example 2: Custom (50 words)
    print("\n--- 50 WORD SUMMARY ---")
    print(run(cnn_url, num_of_words=50))
