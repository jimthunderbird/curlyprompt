#!/bin/bash

while true; do
    echo "--- Starting Iteration ---"

    rm -f action.js

    # 1. Run the local LLM code generation script
    echo "Running local_llm_codegen.sh..."
    sh ./local_llm_codegen.sh

    # 2. Count .prompt files in the tests directory
    # Using 'ls -1' and 'wc -l' to get the total count
    N=$(ls -1 ./tests/*.prompt 2>/dev/null | wc -l)

    if [ "$N" -eq 0 ]; then
        echo "No .prompt files found in ./tests. Exiting."
        exit 1
    fi

    echo "Found $N prompt files. Running tests..."

    num_of_passed_test=0

    # 3. Loop through tests from 1 to N
    for ((i=1; i<=N; i++)); do
        prompt_file="./tests/test_markdown_${i}.prompt"
        tmp_output="./tests/test${i}_tmpoutput.md"
        expected_output="./tests/test_markdown_${i}.md"

        # Run the action.js command
        node action.js "$prompt_file" "$tmp_output"

        # Compare file contents
        # -s suppresses output, -q is quiet mode
        if cmp -s "$tmp_output" "$expected_output"; then
            ((num_of_passed_test++))
            echo "Test $i: PASSED"
        else
            echo "Test $i: FAILED"
        fi
    done

    echo "Results: $num_of_passed_test/$N passed."

    # 4. Break if all tests passed
    if [ "$num_of_passed_test" -eq "$N" ]; then
        echo "All tests passed! Exiting loop."
        break
    fi

    echo "Retrying..."
    echo ""
done
