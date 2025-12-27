# CurlyPrompt

## Purpose
A prompting language for generating prompts for LLM

## Features
- Use curly bracket
- Prompt result caching
- Prompt script monitoring
- Use @context directory to include different context

## Example
A simple php script
```prompt hello.prompt
@context(php_runner.instruction.prompt)
print "hello"
```
```bash
./agent hello.prompt
```

## License
MIT License
