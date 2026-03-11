### **Directory:** examples/web_clawing_project_gutenberg

**File:** `App.prompt`
```prompt
class App
{
  init() {
    show me the project gutenberg new releases information
  }
}
```

Or **File:** `App.prompt`
```prompt
class App
{
  init() {
    Tool.getProjectGutenbergNewReleasesInfo()  
  }
}
```

### 100% local php action agent powered by qwen3-coder:30b
```
sh agents/local_action_agent.sh examples/web_clawing_project_gutenberg
```
