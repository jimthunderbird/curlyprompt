#!/bin/bash

# 1. Check if input file exists
if [ -z "$1" ] || [ ! -f "$1" ]; then
    echo "Usage: ./to_markdown.sh <filename>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}.md"

echo "Processing $INPUT_FILE via Ollama..."

# 2. Use Python to handle the entire API lifecycle
python3 -c '
import json
import sys
import urllib.request
import re

input_file = sys.argv[1]
output_file = sys.argv[2]

try:
    # Read the content of your spec.prompt
    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Prepare the JSON payload
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "qwen2.5-coder:7b",
        "prompt": f"Convert the following into clean markdown. Output ONLY the markdown content:\n\n{content}",
        "stream": False
    }

    # Send the Request
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        
        # Extract the "response" field from Ollama
        markdown_output = res_data.get("response", "")
        markdown_output = re.sub(r"^```markdown\s*|```$", "", markdown_output, flags=re.IGNORECASE).strip()

        # Write to the .md file
        with open(output_file, "w", encoding="utf-8") as f_out:
            f_out.write(markdown_output)
            
    print(f"Successfully converted to {output_file}")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
' "$INPUT_FILE" "$OUTPUT_FILE"
