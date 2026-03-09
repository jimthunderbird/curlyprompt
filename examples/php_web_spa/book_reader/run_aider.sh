PROMPT_FILE=./spec.prompt
entrypoint=$(grep "entrypoint" spec.prompt | cut -d':' -f2 | xargs)
aider $entrypoint \
      --subtree-only --model ollama_chat/qwen3-coder:30b \
      --set-env OLLAMA_API_BASE=http://localhost:11434 \
      --msg "$(cat $PROMPT_FILE)" \
      --yes
