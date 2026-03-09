aider ./spa_php.php \
      --subtree-only --model ollama_chat/qwen3-coder:30b \
      --set-env OLLAMA_API_BASE=http://localhost:11434 \
      --msg "$(cat spa_php.prompt)" \
      --yes
