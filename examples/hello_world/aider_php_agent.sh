PROMPT_FILE=spec.prompt
MAIN_FILE=main.php
rm -f $MAIN_FILE
CUR_DIR="./"
MAIN_FILE="$CUR_DIR/$MAIN_FILE"

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
EOF
)

PROMPT="$INSTRUCTION\n\n$PROMPT"

aider --subtree-only --model ollama_chat/qwen3-coder:30b \
      --file "$MAIN_FILE" \
      --read *.prompt \
      --no-auto-test \
      --no-auto-lint \
      --set-env OLLAMA_API_BASE=http://localhost:11434 \
      --msg "$PROMPT" \
      --map-tokens 0 \
      --yes
