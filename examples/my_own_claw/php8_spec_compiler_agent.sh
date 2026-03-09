#!/bin/bash

# Check if the first argument ($1) is empty
if [ -z "$1" ]; then
  echo "Please provide prompt file"
  exit 1
fi

ORIGINAL_PROMPT=$(cat $1)

echo "$ORIGINAL_PROMPT" > tmp
APP_SPEC_TEST_CONTENT=$(awk '/app_spec \{/{flag=1; next} /^[[:space:]]*\}/{flag=0} flag {print "  it should: " $0}' tmp)

TEST_BLOCK="\ntests {\n$APP_SPEC_TEST_CONTENT \n}"

FINAL_PROMPT="$ORIGINAL_PROMPT\n$TEST_BLOCK"

OUTPUT=$(echo "$FINAL_PROMPT" | ollama run qwen3-coder:30b)
sed -e '/^```php$/d' -e '/^```$/d' <<< "$OUTPUT" > ${1%.prompt}.php
