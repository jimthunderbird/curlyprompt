import ollama

def run(content_1, content_2, word_limit=100):
    """
    Given 2 pieces of content, writes a creative story covering both.
    :param content_1: The first piece of content to incorporate.
    :param content_2: The second piece of content to incorporate.
    :param word_limit: Maximum word count for the story.
    """
    prompt = (
        "Write a creative short story that weaves together the following two pieces of content "
        f"into a single cohesive narrative. Keep the story within {word_limit} words.\n\n"
        f"Content 1:\n{content_1}\n\n"
        f"Content 2:\n{content_2}\n\n"
        "The story should be engaging, imaginative, and naturally incorporate elements from both contents."
    )

    response = ollama.chat(
        model='gemma3:latest',
        messages=[{'role': 'user', 'content': prompt}]
    )

    return response['message']['content']

# Example Usage
if __name__ == "__main__":
    story = run("this is story 1", "this is story 2", 100)
    print(story)
