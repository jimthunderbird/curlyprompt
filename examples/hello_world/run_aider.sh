PROMPT_FILE=./spec.prompt
CUR_DIR=$(dirname "$(realpath $PROMPT_FILE)")
PROMPT=$(sed "s|\$CUR_DIR|$CUR_DIR|g" $PROMPT_FILE)

aider --subtree-only --model ollama_chat/qwen3-coder:30b \
      --file "$CUR_DIR/main.php" \
      --read *.prompt \
      --no-auto-test \
      --no-auto-lint \
      --set-env OLLAMA_API_BASE=http://localhost:11434 \
      --msg "$PROMPT" \
      --map-tokens 0 \
      --yes
