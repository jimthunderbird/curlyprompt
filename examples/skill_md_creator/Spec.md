# Spec: CurlyPrompt-to-SKILL Markdown Converter

## 1. Overview

`action.js` is a Node.js CLI tool that converts **CurlyPrompt DSL** (`.prompt` files) into **SKILL Markdown** (`.md` files) — a YAML-frontmatter Markdown format consumable by AI agents.

**Invocation:**

```bash
node action.js <source.prompt> <target.md>
```

The program reads the source file synchronously, parses it, and writes the target file synchronously. It exports a single static class `Converter` with the entry point `Converter.convertCurlyPromptToSKILL(source, target)`.

---

## 2. High-Level Architecture

The conversion pipeline has four sequential stages:

| Stage | Description |
|-------|-------------|
| **1. Parse** | Read the `.prompt` file, identify the `skill { }` root block, extract frontmatter key-value pairs and content lines. |
| **2. Build Frontmatter** | Emit YAML frontmatter delimited by `---` lines from the parsed key-value pairs. |
| **3. Process Content** | Walk the collected content lines, recognize DSL elements, and emit corresponding Markdown. |
| **4. Write** | Join all output lines with `\n`, append a trailing `\n`, and write to the target file. |

### Class: `Converter` (static-only)

| Method | Responsibility |
|--------|---------------|
| `convertCurlyPromptToSKILL(source, target)` | Orchestrates the full pipeline (stages 1–4). |
| `parseFrontmatterLine(line, frontmatter, lines, i, setI)` | Parses a single frontmatter key-value pair or `meta { }` block. Mutates `frontmatter` object. |
| `processFormatting(text)` | Applies inline formatting transforms (links, bold, italic, inline code) to a text string. Returns transformed string. |
| `processContentLines(lines, output)` | Iterates content lines, dispatches to element handlers, and pushes Markdown lines into `output` array. |

---

## 3. Input Format — CurlyPrompt DSL

### 3.1 Root Structure

Every `.prompt` file must contain exactly one `skill { }` block at the top level. All content outside this block is ignored.

```
skill {
  <frontmatter key-value pairs OR header block>
  <content block OR body block>
}
```

### 3.2 Frontmatter Section

Frontmatter can appear in two forms:

#### Form A: Flat key-value pairs (before `content {`)

```
skill {
  name: "Simple Skill"
  description: "A simple skill for AI Agent"
  license: "MIT"
  version: "1.0"
  include: global-restriction.md
  content {
    ...
  }
}
```

#### Form B: Explicit `header { }` (or `head { }`) and `body { }` blocks

```
skill {
  header {
    name: Simple Header Test
    description: Testing basic header and body sections
    version: 2.0
    include: shared-rules.md
    meta {
      team: backend
      env: production
    }
  }
  body {
    ...
  }
}
```

`header { }` (or its alias `head { }`) is an explicit grouping of frontmatter. `body { }` is an alias for `content { }`.

#### Supported Frontmatter Keys

| Key | Required | Description |
|-----|----------|-------------|
| `name` | Yes | Skill name. Quotes are stripped if present. |
| `description` | Yes | One-line description. Quotes are stripped if present. |
| `license` | No | License identifier (e.g., `MIT`, `Apache-2.0`). Quotes stripped. |
| `version` | No | Version string. Quotes stripped. |
| `include` | No | Path to an external file to include. Quotes stripped. |
| `meta { }` | No | Nested block of arbitrary key-value pairs. See section 3.3. |

#### Quote Handling

All double quotes (`"`) in frontmatter values are **stripped**. Both quoted and unquoted values are supported:

```
name: "My Skill"    →  name: My Skill
name: My Skill      →  name: My Skill
```

### 3.3 Meta Block

The `meta { }` block provides arbitrary nested metadata:

```
meta {
  author: John Doe
  category: utilities
  platform: cross-platform
}
```

- Each line inside `meta { }` is parsed as `key: value`.
- The colon (`:`) is the delimiter; everything before it is the key, everything after is the value.
- Quotes are stripped from values.
- `meta` can appear inside `header { }` or at the flat frontmatter level.

### 3.4 Content Block

The content block is delimited by either `content { }` or `body { }`. It contains DSL elements that map to Markdown constructs.

---

## 4. DSL Elements Reference

### 4.1 Headers — `h1:`, `h2:`, `h3:`

**Syntax:**

```
h1:Title Text
h2:Subtitle
h3:Sub-subtitle
```

Headers may optionally open a brace-delimited section:

```
h1:Section Title {
  <nested elements>
}
```

When a header line ends with `{`, the `{` is stripped from the title text. The section closing `}` is silently consumed.

**Output:**

```markdown
# Title Text

## Subtitle

### Sub-subtitle
```

Every header is followed by an empty line.

**Inline formatting** is applied to header text (e.g., `h2:strong:Important` → `## **Important**`).

### 4.2 Paragraphs — `p:`, `p { }`, `p{...}`

Three forms are supported:

#### Inline form: `p:TEXT`

```
p:This is a paragraph.
```

Output:

```markdown
This is a paragraph.

```

#### Block form: `p { ... }`

```
p {
  First line of paragraph.
  Second line of paragraph.
}
```

Output (each non-empty line is emitted, followed by one trailing blank line):

```markdown
First line of paragraph.
Second line of paragraph.

```

Empty lines within `p { }` are skipped. Inline formatting is applied to each line.

#### Same-line form: `p{TEXT}`

```
p{this is a same-line paragraph}
```

Output:

```markdown
this is a same-line paragraph

```

The content between `p{` and the closing `}` (on the same line) is extracted and emitted as a paragraph. Inline formatting is applied.

### 4.3 Unordered Lists — `ul { }`

```
ul {
  li:First item
  li:Second item
  li:Third item
}
```

Output:

```markdown
- First item
- Second item
- Third item

```

- Only `li:` prefixed lines inside `ul { }` are processed; other lines are ignored.
- Inline formatting is applied to each list item text.
- A trailing blank line is appended after the list.

### 4.4 Ordered Lists — `ol { }`

```
ol {
  li:First item
  li:Second item
  li:Third item
}
```

Output:

```markdown
1. First item
2. Second item
3. Third item

```

- Numbering starts at 1 and increments for each `li:` line.
- Inline formatting is applied.
- A trailing blank line is appended.

### 4.5 Standalone List Items — `li:`

```
li:Standalone bullet point
```

Output:

```markdown
- Standalone bullet point
```

- Rendered as an unordered list item.
- Inline formatting is applied.
- **No** trailing blank line (unlike `ul { }`).

### 4.6 Code Blocks — `code { }`

```
code {
  function hello() {
    console.log("Hello");
    return true;
  }
}
```

Output:

````markdown
```
function hello() {
  console.log("Hello");
  return true;
}
```

````

**Indentation handling:**
- Lines inside `code { }` are collected **raw** (untrimmed).
- The minimum leading whitespace across all non-empty lines is calculated.
- That common indentation prefix is stripped from every line.
- Brace depth tracking is used to find the matching closing `}` (inner braces within code are not treated as block terminators).

**Brace depth rules for code blocks:**
- Start at depth 1 when entering the code block.
- A line that is exactly `}` (trimmed) decrements depth. If depth reaches 0, that's the closing brace.
- Otherwise, count `{` and `}` characters in the line to adjust depth.

### 4.7 Inline Code — `code:TEXT`

```
code:docker build -t myapp .
```

Output:

```markdown
`docker build -t myapp .`

```

When `code:` appears as a standalone line (not inside a list or paragraph), it wraps the text in backticks and appends a blank line.

### 4.8 Blockquotes — `blockquote:TEXT`

```
blockquote:This is an important note.
```

Output:

```markdown
> This is an important note.

```

- Inline formatting is applied to the text.
- A trailing blank line is appended.

### 4.9 Horizontal Rules — `hr`

```
hr
```

Output:

```markdown
---

```

A trailing blank line is appended.

### 4.10 Images — `img:ALT:PATH`

```
img:Docker Architecture:docs/docker-arch.png
```

Output:

```markdown
![Docker Architecture](docs/docker-arch.png)

```

- Format: `img:<alt_text>:<image_path>`
- The first `:` after `img:` separates alt text from path.
- A trailing blank line is appended.

**Brace syntax (one-line):**

```
img{src:"http://www.dummyimage.com/dummy.jpg",alt:"dummy image"}
img{ src:"http://www.dummyimage.com/dummy.jpg" , alt:"dummy image"}
img{ src:"http://www.dummyimage.com/dummy.jpg" alt:"dummy image"}
img{  src:"http://www.dummyimage.com/dummy.jpg"   alt:"dummy image"}
```

Output (all produce the same):

```markdown
![dummy image](http://www.dummyimage.com/dummy.jpg)

```

- Format: `img{src:"<url>" alt:"<alt_text>"}` or `img{alt:"<alt_text>" src:"<url>"}`
- Key-value pairs can be separated by commas, spaces, or both — spacing is flexible.
- Values are quoted with double quotes.
- Key order does not matter (`src` and `alt` can appear in any order).
- A trailing blank line is appended.

### 4.11 Links — `link:DISPLAY:URL`

Links are an **inline formatting** construct (not a standalone element):

```
p:Visit link:Google:https://www.google.com for searching.
```

Output:

```markdown
Visit [Google](https://www.google.com) for searching.
```

- Format: `link:<display_text>:<url>`
- URL must start with `http://` or `https://`.
- The regex: `link:(.+?):(https?:\/\/\S+)`

---

## 5. Inline Formatting Rules

Inline formatting is applied by `processFormatting(text)` and is invoked on: header text, paragraph text, list item text, and blockquote text.

Formatting transforms are applied **in this exact order**:

### 5.1 Links

```
link:display text:https://example.com  →  [display text](https://example.com)
```

Regex: `link:(.+?):(https?:\/\/\S+)`

### 5.2 Same-Line Strong — `strong{...}`

```
strong{this is very important}  →  **this is very important**
```

Regex: `strong\{([^}]+)\}` → `**$1**`

Content between `strong{` and `}` on the same line is bolded.

### 5.3 Same-Line Italic — `italic{...}`

```
italic{key concept}  →  *key concept*
```

Regex: `italic\{([^}]+)\}` → `*$1*`

### 5.4 Word-Capture Strong — `strong:WORDS`

```
strong:important instruction  →  **important** instruction
```

Captures one or more words after `strong:`. A "word" matches `[\w.]+` with optional hyphenated parts (`[\w.]+-[\w.]+`). Capture **stops** before any of these stop words:

```
to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an,
instruction, token, supported, setup, requests, mock, approach, function, word, text,
specification, element, steps, style, content, authentication, inside, guide, mode,
scripts, paragraph
```

**Examples:**

| Input | Output |
|-------|--------|
| `strong:important instruction` | `**important** instruction` |
| `strong:bold text and more` | `**bold text** and more` |
| `strong:critical checks pass before deploying` | `**critical checks pass before deploying**` |
| `strong:every supported element` | `**every** supported element` |
| `strong:conventional commits with format` | `**conventional commits** with format` |

The stop word list is checked with word boundary (`\b`). Words are greedily captured until a stop word is encountered.

### 5.5 Word-Capture Italic — `italic:WORDS`

```
italic:important and more  →  *important* and more
```

Stop words for italic:

```
to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an,
text, information, reviewers
```

Same word-capture mechanics as `strong:`.

### 5.6 Word-Capture Inline Code — `code:WORDS`

```
code:docker build -t myapp . to build the image  →  `docker build -t myapp .` to build the image
```

Stop words for inline code:

```
to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an,
parameters, branch, prefix
```

The capture pattern uses `\S+` (non-whitespace) for tokens instead of `[\w.]+`, allowing special characters in code spans.

---

## 6. Output Format — SKILL Markdown

### 6.1 Structure

```markdown
---
<YAML frontmatter>
---

<Markdown body>
```

### 6.2 Frontmatter Serialization

- Delimited by `---` lines.
- Each key is emitted as `key: value` (flat).
- `meta` is emitted as a nested YAML mapping:
  ```yaml
  meta:
    key1: value1
    key2: value2
  ```
- Key order follows insertion order in the parsed `frontmatter` object (i.e., order of appearance in the source file).
- A blank line is emitted after the closing `---`.

### 6.3 Markdown Body

- Each element is followed by a trailing blank line (except standalone `li:` items).
- Code blocks use fenced syntax with triple backticks (no language specifier).
- No nested lists are supported.
- Section braces (`h1:Title { ... }`) are structural grouping only — they do not affect Markdown indentation or nesting.

---

## 7. Content Block Parsing — Brace Depth Tracking

When the parser enters a `content { }` or `body { }` block, it collects all inner lines using brace depth tracking:

1. Start at `brace_depth = 1`.
2. For each line:
   - If trimmed line is exactly `}`: decrement depth. If depth reaches 0, stop collecting.
   - Otherwise: count `{` and `}` characters in the line to adjust depth. Push the **raw** (untrimmed) line.
3. The collected lines are passed to `processContentLines()`.

This ensures nested braces in section headers (`h1:Title {`) and code blocks are properly balanced.

---

## 8. Element Processing Dispatch Order

`processContentLines` checks each trimmed line against element patterns in this priority order:

1. Skip empty lines and lone `}` lines
2. **Header** — `/^(h[1-3]):(.*)/`
3. **Paragraph (same-line)** — `/^p\{(.+)\}$/`
4. **Paragraph (block)** — `p {` or starts with `p {`
5. **Paragraph (inline)** — starts with `p:`
6. **Unordered list** — `ul {`
7. **Ordered list** — `ol {`
8. **Code block** — `code {`
9. **Blockquote** — starts with `blockquote:`
10. **Horizontal rule** — exactly `hr`
11. **Image** — starts with `img:`
12. **Standalone list item** — starts with `li:`
13. **Standalone inline code** — starts with `code:`

This order matters: `p{...}` is matched before `p {` (block form), and `code {` (block) is matched before `code:` (inline).

---

## 9. Edge Cases and Behaviors

### 9.1 Header Text with Trailing `{`

```
h1:Section Title {
```

The `{` is stripped. Output: `# Section Title`. The closing `}` of this section is consumed silently by the content parser.

### 9.2 Frontmatter Without Quotes

Quotes around values are optional. Both produce identical output:

```
name: "My Skill"
name: My Skill
```

### 9.3 Minimal Skill (No Optional Fields)

A skill may omit `license`, `version`, `include`, and `meta`. Only `name` and `description` are expected.

### 9.4 Code Block Brace Balancing

Code blocks can contain `{` and `}` characters. The parser tracks brace depth so that inner braces do not prematurely close the code block.

### 9.5 Strong/Italic Stop Word Behavior

The stop word mechanism means the capture is **greedy up to** but not including a stop word. If no stop word is encountered, the capture extends to the end of the word sequence.

### 9.6 Lines Outside `skill { }`

Any text outside the `skill { }` root block is completely ignored.

### 9.7 Trailing Newline

The output file always ends with exactly one trailing newline (`\n`).

---

## 10. Test Harness

### 10.1 Test Structure

Tests are located in `./tests/` with paired files:
- `test_markdown_N.prompt` — input DSL
- `test_markdown_N.md` — expected Markdown output

### 10.2 Test Runner (`init.sh`)

The test runner:
1. Runs `action.js` for each `.prompt` file, producing `testN_tmpoutput.md`.
2. Compares output byte-for-byte (`cmp -s`) against expected `.md` file.
3. Reports pass/fail per test and total count.
4. Loops (regenerating `action.js` via LLM) until all tests pass.

### 10.3 Test Coverage Matrix

| Category | Test Numbers | Features Covered |
|----------|-------------|------------------|
| Basic skills | 1–7 | Frontmatter, headers, paragraphs, `ul`, `strong:` |
| Italic | 8 | `italic:` word capture |
| Blockquote | 9 | `blockquote:` |
| Ordered list | 10 | `ol { }` |
| Code block | 11 | `code { }` with indentation |
| Horizontal rule | 12 | `hr` |
| Links | 13 | `link:display:url` |
| Images | 14 | `img:alt:path` |
| Combined elements | 15 | Multiple element types together |
| Real-world guides | 16–22 | REST API, CI/CD, DB migration, security, Docker, testing, Git |
| Minimal skill | 23 | No optional frontmatter fields |
| Nested sections | 24 | Deep `h1 { h2 { h3 } }` nesting |
| Mixed lists | 25 | `ul` and `ol` in same document |
| Complex formatting | 26–27 | All element types stress test |
| Multi-line paragraph | 28–29 | `p { }` block form with formatting |
| Include keyword | 30–31 | `include:` in frontmatter |
| Meta block | 32–34 | `meta { }` with various attributes |
| Header/body blocks | 35–38 | `header { }` and `body { }` syntax |
| Same-line strong/italic | 39–40 | `strong{...}`, `italic{...}` |
| Same-line paragraph | 41 | `p{...}` form |
| Head alias | 42–43 | `head { }` as alias for `header { }` |
| Image brace variants | 44–45 | Existing image brace tests |
| Image flexible spacing | 46–47 | `img{...}` with commas, spaces, varied spacing |

---

## 11. Dependencies

- **Node.js** — runtime (no minimum version specified; uses `require`, `fs.readFileSync`, `fs.writeFileSync`)
- **No external packages** — zero `npm` dependencies; the module uses only the built-in `fs` module

---

## 12. File I/O Contract

| Operation | Method | Encoding |
|-----------|--------|----------|
| Read source | `fs.readFileSync(path, 'utf8')` | UTF-8 |
| Write target | `fs.writeFileSync(path, content)` | Default (UTF-8) |

The program is **synchronous** — no async/callback patterns.

---

## 13. CLI Interface

```
node action.js <source_prompt_file> <target_md_file>
```

- `process.argv[2]` — source `.prompt` file path
- `process.argv[3]` — target `.md` file path
- If fewer than 4 arguments, the program silently exits (no error).
- No flags, options, or `--help` support.
