#!/bin/bash

# Check if at least one argument is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <application_directory>"
    echo "Example: $0 ./my-php-project"
    exit 1
fi

cd $1

# Configuration
PROMPT_FILE="spec.prompt"
MAIN_FILE="main.php"
# Get the absolute path of the current directory
CUR_DIR=$(pwd)
# Define the absolute path for the main file to prevent aider from wandering
ABS_MAIN_FILE="$CUR_DIR/$MAIN_FILE"

# Clean up existing file
rm -f "$ABS_MAIN_FILE"

# Read the spec prompt if it exists (assuming $PROMPT should contain its content)
if [ -f "$PROMPT_FILE" ]; then
    SPEC_CONTENT=$(cat "$PROMPT_FILE")
else
    SPEC_CONTENT="No spec provided."
fi

INSTRUCTION=$(cat <<EOF
role: PHP 8 Expert

objective: generate a php file based on spec

constraint {
  when we see <CLASS_NAME>.<METHOD_NAME>(<param1>,<param2>...) {
    use the attached $CUR_DIR/<CLASS_NAME>.prompt file as the source of truth to implement the logic 
    create class <CLASS_NAME> and corresponding <METHOD_NAME>(<param1>,<param2>...) in PHP
  }
  In the php file, invoke <CLASS_NAME>.<METHOD_NAME>(<param1>,<param2>...)
}

Spec:
$SPEC_CONTENT
EOF
)

# Run aider with the --subtree-only flag and absolute path
# We use --read with absolute paths to ensure the context is pinned correctly
aider --subtree-only --model ollama_chat/qwen3-coder:30b \
      --file "$ABS_MAIN_FILE" \
      --read "$CUR_DIR"/*.prompt \
      --no-auto-test \
      --no-auto-lint \
      --set-env OLLAMA_API_BASE=http://localhost:11434 \
      --msg "$INSTRUCTION" \
      --map-tokens 0 \
      --yes

# Verify location
if [ -f "$ABS_MAIN_FILE" ]; then
    echo "Success: $MAIN_FILE created in $CUR_DIR"
else
    echo "Warning: $MAIN_FILE not found in $CUR_DIR. Check parent directories."
fi
