mlx_lm.fuse \
  --model "mlx-community/gemma-3-270m-it-4bit" \
  --adapter-path ./dsl_adapter \
  --save-path ./fused_curlyprompt-skill-convert_gemma
