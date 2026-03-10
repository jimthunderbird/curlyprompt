# **Directory:** `examples/document_summarizer`

**File:** `App.prompt`

```prompt
class App
{
  init() {
    let article = ./docs/php.md
    let content = get the content of {article}
    let prompt = "
    summarize <content>{content}</content> in 50 words
    list all the urls
    "
    let summary = LLM.sendPrompt(prompt)
    write {summary} to ./docs/php.summary.txt {
      if successful: print "successfully generated summary"
      if failed: print "failed generated summary"
    }
  }
}
```

**File:** `LLM.prompt`

```prompt
class LLM
{
  config {
    api_endpoint:"127.0.0.1:11434"
    model:"gemma3:latest"
    thinking_mode:false
  }

  sendPrompt(prompt) {
    //act as an Ollma Local API Expert
    let result = (send curl request based on {config} and with prompt: {prompt})
    return result
  }
}
```

```
sh agents/local_php_action_agent.sh examples/document_summarizer
```
