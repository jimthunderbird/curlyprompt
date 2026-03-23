import ollama

def run(problem):
    """
    Given a math problem (middle school to high school level), returns its solution.
    :param problem: The math problem to solve.
    """
    prompt = (
        "You are a math tutor. Solve the following math problem step by step, "
        "then provide the final answer.\n\n"
        f"Problem: {problem}\n\n"
        "Show your work clearly and state the final answer."
    )

    stream = ollama.chat(
        model='mightykatun/qwen2.5-math:7b',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
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
    result = run("what is 1+1")
    print(result)
