#!/bin/bash

APP_init() {
  local article="./docs/php.md"
  local summary_file="./docs/php.summary.txt"
  
  if [[ ! -f "$article" ]]; then
    echo "failed generated summary"
    exit 1
  fi
  
  local content=$(cat "$article")
  local prompt="Summarize the following content in 50 words and list all the URLs:\n\n$content"
  
  local result=$(curl -s -X POST "http://127.0.0.1:11434/api/generate" \
    -d "{\"model\":\"gemma3:latest\",\"prompt\":\"$prompt\",\"stream\":false}" 2>/dev/null)
  
  if [[ -z "$result" ]]; then
    echo "failed generated summary"
    exit 1
  fi
  
  local summary=$(echo "$result" | jq -r '.response' 2>/dev/null | sed 's/\\n/\\\\n/g')
  
  if [[ -z "$summary" ]]; then
    echo "failed generated summary"
    exit 1
  fi
  
  echo "$summary" > "$summary_file"
  
  if [[ $? -eq 0 ]]; then
    echo "successfully generated summary"
  else
    echo "failed generated summary"
  fi
}

APP_init

