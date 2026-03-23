import ollama

def run(*contents, word_limit=100, constraint=None):
    """
    Given multiple pieces of content, writes a creative story covering all of them.
    :param contents: Variable number of content pieces to incorporate.
    :param word_limit: Maximum word count for the story.
    :param constraint: Optional style or tone constraint (e.g., "use shakespear tone").
    """
    if not contents:
        raise ValueError("At least one content piece is required.")

    content_sections = "\n\n".join(
        f"Content {i+1}:\n{c}" for i, c in enumerate(contents)
    )
    constraint_instruction = f" Constraint: {constraint}." if constraint else ""
    prompt = (
        f"Write a creative short story that weaves together the following {len(contents)} "
        f"piece(s) of content into a single cohesive narrative. "
        f"Keep the story within {word_limit} words.{constraint_instruction}\n\n"
        f"{content_sections}\n\n"
        "The story should be engaging, imaginative, and naturally incorporate elements from all contents."
    )

    stream = ollama.chat(
        model='gemma3:latest',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True
    )

    result = []
    for chunk in stream:
        token = chunk['message']['content']
        print(token, end='', flush=True)
        result.append(token)
    print()

    return ''.join(result)

# Example Usage
if __name__ == "__main__":
    story = run("this is story 1", "this is story 2", "this is story 3", word_limit=100, constraint="use shakespear tone")
    print(story)
