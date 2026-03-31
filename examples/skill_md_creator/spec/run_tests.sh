#!/bin/bash

num_passed=0
num_total=0
failed_tests=""

for f in tests/*.prompt; do
  base=$(basename "$f" .prompt)
  num_total=$((num_total + 1))

  python3.11 converter.py "tests/${base}.prompt" "tests/${base}.tmpoutput.md" 2>/dev/null

  if diff -q "tests/${base}.tmpoutput.md" "tests/${base}.md" > /dev/null 2>&1; then
    num_passed=$((num_passed + 1))
  else
    failed_tests="$failed_tests ${base}"
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
