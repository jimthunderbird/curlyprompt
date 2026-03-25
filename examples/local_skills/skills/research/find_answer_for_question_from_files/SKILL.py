import requests
import json
import sys


def run(question, *file_paths):
    prompt = "<context>\n"
    for file_path in file_paths:
        with open(file_path, "r") as f:
            prompt += f.read()
    prompt += "</context>\n\n"

    prompt += "based on <context> above, answer the following question:\n\n"
    prompt += "<question>\n"
    prompt += question
    prompt += "\n</question>\n"

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen3-coder:30b",
            "prompt": prompt,
            "stream": True,
        },
        stream=True,
    )
    response.raise_for_status()

    for line in response.iter_lines():
        if line:
            data = json.loads(line)
            if "response" in data:
                print(data["response"], end="", flush=True)
            if data.get("done"):
                break

    print()
