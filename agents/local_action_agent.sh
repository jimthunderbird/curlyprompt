#!/bin/bash

LOCAL_LLM_MODEL="qwen3-coder:30b"

ACTION_FILE="action.js"

# Check if at least one argument is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <application_directory>"
    echo "Example: $0 ./examples/web_clawing_project_gutenberg"
    exit 1
fi

cd $1

# Check if git status shows no file changed
if git status --short 2>/dev/null | grep -q .; then
    :  # Files changed, continue normally
else
    # No files changed, run action and exit
    node $ACTION_FILE
    exit 1
fi

# Install Packages
npm install

# 1. Initialize the base prompt
PROMPT="role: Node.js Expert

objective: generate a Node.js file using CommonJS based on spec, no explanation, no extra words
"

# 2. Loop through each .prompt file and append content
# We check if files exist to avoid errors in empty directories
shopt -s nullglob
for f in *.prompt; do
    PROMPT+=$'\n'
    PROMPT+=$(cat "$f")
    PROMPT+=$'\n'
done

PROMPT+="$PROMPT\n\nif class App exists, call APP.init()"

ollama run $LOCAL_LLM_MODEL "$PROMPT" | grep --line-buffered -vE '```javascript|```' | tee $ACTION_FILE

echo "Generated $ACTION_FILE"

# execute php action
node $ACTION_FILE

# back to original directory
cd -
