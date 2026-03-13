#!/bin/bash

num_passed=0
num_total=0
failed_tests=""

for f in tests/test_markdown_*.prompt; do
  i=$(echo "$f" | sed 's/.*test_markdown_\([0-9]*\)\.prompt/\1/')
  num_total=$((num_total + 1))

  node action.js "tests/test_markdown_${i}.prompt" "tests/test${i}_tmpoutput.md" 2>/dev/null

  if diff -q "tests/test${i}_tmpoutput.md" "tests/test_markdown_${i}.md" > /dev/null 2>&1; then
    num_passed=$((num_passed + 1))
  else
    failed_tests="$failed_tests $i"
  fi
done

echo "Passed: $num_passed / $num_total"

if [ -n "$failed_tests" ]; then
  echo "Failed tests:$failed_tests"
  exit 1
else
  echo "All tests passed!"
  exit 0
fi
