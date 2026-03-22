#!/usr/bin/env python3

import sys
import os
import re
import json
import subprocess
import requests

# Local LLM config
llm_host = 'localhost'
llm_port = 11434
llm_model = 'qwen3-coder:30b-determin'


def send_to_llm(host, port, model, prompt):
    """Send a prompt to the local Ollama LLM and return the response."""
    url = f"http://{host}:{port}/api/generate"
    payload = json.dumps({
        'model': model,
        'prompt': prompt,
        'stream': False,
    })
    try:
        resp = requests.post(url, data=payload, headers={'Content-Type': 'application/json'}, timeout=300)
        resp.raise_for_status()
        data = resp.json()
        return data.get('response', '')
    except requests.RequestException as e:
        print(f"Request error: {e}")
        sys.exit(1)


def send_to_llm_stream(host, port, model, prompt):
    """Send a prompt to the local Ollama LLM with streaming and return the full response."""
    url = f"http://{host}:{port}/api/generate"
    payload = json.dumps({
        'model': model,
        'prompt': prompt,
        'stream': True,
    })
    full_response = ''
    try:
        with requests.post(url, data=payload, headers={'Content-Type': 'application/json'}, timeout=300, stream=True) as resp:
            resp.raise_for_status()
            for line in resp.iter_lines(decode_unicode=True):
                if not line or not line.strip():
                    continue
                chunk = json.loads(line.strip())
                if 'response' in chunk:
                    print(chunk['response'], end='', flush=True)
                    full_response += chunk['response']
    except requests.RequestException as e:
        print(f"Request error: {e}")
        sys.exit(1)
    print()
    return full_response


# input_prompt: the first argument
if len(sys.argv) < 2:
    print("Usage: python agent.py <prompt>")
    sys.exit(1)
input_prompt = sys.argv[1]

# cli_find_skill_markdowns: find ./skills/ -type f -name "SKILL.md"
skill_file_paths = subprocess.check_output(
    ['find', './skills/', '-type', 'f', '-name', 'SKILL.md'],
    text=True
).strip()

# Build intent_prompt
intent_prompt = f"skill_file_paths {{\n{skill_file_paths}\n}}\n"
intent_prompt += f"instruction {{\n{input_prompt}\n}}\n"
intent_prompt += "action {\nreturn the file paths in skill_file_paths that maps the intent of instruction, one path per line, no explanation, no extra words\n}\n"

print("loading skills...")

# Send intent_prompt to local LLM to get related skill file paths
related_skill_file_paths_raw = send_to_llm(llm_host, llm_port, llm_model, intent_prompt)
related_skill_file_paths = [p.strip() for p in related_skill_file_paths_raw.strip().split('\n') if p.strip()]

# Build final_prompt
final_prompt = "contex {\n"
for file_path in related_skill_file_paths:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            skill_file_content = f.read()
        tmp = re.sub(r'/SKILL\.md$', '', file_path)
        tmp = re.sub(r'^\./', '', tmp)
        python_import_package = tmp.replace('/', '.')
        skill_file_content = skill_file_content.replace('{skill_package_import}', f'from {python_import_package} import SKILL')
        final_prompt += skill_file_content + "\n"
final_prompt += "}\n"
final_prompt += f"task {{\n{input_prompt}\n}}\n"
final_prompt += "action {\nlearn from context, use context as example, generate python code to complete the task, show me the python code only, no explanation, no extra words\n}\n"

# Send final_prompt to local LLM with streaming
result = send_to_llm_stream(llm_host, llm_port, llm_model, final_prompt)

print("generating action")

# Extract python code between first ```python and ```
match = re.search(r'```python\s*\n(.*?)```', result, re.DOTALL)
if match:
    python_action_code = match.group(1)
else:
    print("No python code block found in LLM response.")
    print(result)
    sys.exit(1)

# Save python_action_code to ./final_action.py
with open('./final_action.py', 'w') as f:
    f.write(python_action_code)

print("running action...")

# Run cli: python3.11 final_action.py
exit_code = subprocess.call(['python3.11', 'final_action.py'])
sys.exit(exit_code)
