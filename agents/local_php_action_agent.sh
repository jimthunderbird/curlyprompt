#!/bin/bash

LOCAL_LLM_MODEL="qwen3-coder:30b"

PHP_ACTION_FILE="action.php"

# Check if at least one argument is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <application_directory>"
    echo "Example: $0 ./my-php-project"
    exit 1
fi

cd $1

# 1. Initialize the base prompt
PROMPT="role: PHP 8 Expert

objective: generate a php file based on spec, no explanation, no extra words
"

# 2. Loop through each .prompt file and append content
# We check if files exist to avoid errors in empty directories
shopt -s nullglob
for f in *.prompt; do
    PROMPT+=$'\n'
    PROMPT+=$(cat "$f")
    PROMPT+=$'\n'
done

PROMPT+="$PROMPT\nAPP.init()"

ollama run $LOCAL_LLM_MODEL "$PROMPT" | grep --line-buffered -vE '```php|```' | tee $PHP_ACTION_FILE

echo "Generated $PHP_ACTION_FILE"

# execute php action
php $PHP_ACTION_FILE

# back to original directory
cd -
