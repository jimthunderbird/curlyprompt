#!/bin/bash

# Check if the first argument ($1) is empty
if [ -z "$1" ]; then
  echo "Please provide prompt file"
  exit 1
fi

OUTPUT=$(cat $1 | ollama run qwen3-coder:30b)
sed -e '/^```php$/d' -e '/^```$/d' <<< "$OUTPUT" > ${1%.prompt}.php
