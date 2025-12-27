# CurlyPrompt

## Purpose
A prompting language for generating prompts for LLM

## Features
- Use curly bracket
- Prompt result caching
- Prompt script monitoring
- Use @context directory to include different context

## Example
* A simple php script
```prompt hello.prompt
@context(php_runner.instruction.prompt)
print "hello"
```
```bash
./agent hello.prompt
```

* Running multiple agents in parallel
```prompt run_scripts_in_parallel.prompt
@context(../context/python_script_runner.instruction.prompt)

let helpers = [
  prompts/php/helper/get_happy_new_year_greets.prompt
  prompts/php/helper/md5_for_test.prompt
]

let result_components = []

for each {helper} in {helpers} {
  result_components.push((run cli command: ./agent {helper}))
}

let result = join result_components with ":"

print result
```
```bash
./agent run_scripts_in_parallel.prompt
```


## License
MIT License
