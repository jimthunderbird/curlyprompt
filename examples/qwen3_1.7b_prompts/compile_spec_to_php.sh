cat spec.prompt | ollama run qwen3:1.7b > tmp; ggrep -Pzo '(?s)```php\n\K.*?(?=\n```)' tmp > spec.php; php spec.php
