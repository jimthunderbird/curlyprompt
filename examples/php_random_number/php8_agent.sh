OUTPUT=$(cat spec.prompt | ollama run qwen2.5-coder:7b)
sed -e '/^```php$/d' -e '/^```$/d' <<< "$OUTPUT" > spec.php
