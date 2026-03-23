import ollama

def run(word):
    """
    Given a word, returns its meaning from the dictionary.
    :param word: The word to look up.
    """
    prompt = (
        "You are a dictionary. Given the following word, provide its definition, "
        "part of speech, and a brief example sentence. "
        "If the word appears to be misspelled, suggest the correct spelling and provide "
        "the definition for the corrected word.\n\n"
        f"Word: {word}"
    )

    response = ollama.chat(
        model='gemma3:1b',
        messages=[{'role': 'user', 'content': prompt}]
    )

    return response['message']['content']

# Example Usage
if __name__ == "__main__":
    meaning = run("aquire")
    print(meaning)
