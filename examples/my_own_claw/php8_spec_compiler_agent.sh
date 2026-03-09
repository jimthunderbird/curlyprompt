#!/bin/bash

# Check if the first argument ($1) is empty
if [ -z "$1" ]; then
  echo "Please provide prompt file"
  exit 1
fi

PROMPT_PREPEND_STR="
role: PHP 8 Expert

objective: {
  generate php codeblock based on app_spec below, no extra words, no explanation
  output RAW text only, do not use markdown code blocks
  must pass test1,test2,test3,test4
}
"

ORIGINAL_PROMPT=$(cat $1)

echo "$ORIGINAL_PROMPT" > tmp
APP_SPEC_TEST_CONTENT=$(awk '/app_spec \{/{flag=1; next} /^[[:space:]]*\}/{flag=0} flag {print "  it should: " $0}' tmp)

TEST_BLOCK_1="\ntests1 {\n$APP_SPEC_TEST_CONTENT \n}"
TEST_BLOCK_2="\ntests2 {\n$APP_SPEC_TEST_CONTENT \n}"
TEST_BLOCK_3="\ntests3 {\n$APP_SPEC_TEST_CONTENT \n}"
TEST_BLOCK_4="\ntests4 {\n$APP_SPEC_TEST_CONTENT \n}"

FINAL_PROMPT="$PROMPT_PREPEND_STR\n$ORIGINAL_PROMPT\n$TEST_BLOCK1\n$TEST_BLOCK_2\n$TEST_BLOCK_3\n$TEST_BLOCK_4\n"

echo "$FINAL_PROMPT" > .final.prompt

OUTPUT=$(echo "$FINAL_PROMPT" | ollama run qwen3-coder:30b)
sed -e '/^```php$/d' -e '/^```$/d' <<< "$OUTPUT" > ${1%.prompt}.php
php ${1%.prompt}.php
