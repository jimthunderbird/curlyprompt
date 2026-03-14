# CurlyPrompt Language Tutorial

Reference for all sections covered in [`tutorial/index.html`](tutorial/index.html).

## Table of Contents

### Structure

| Section | ID | Description |
| --- | --- | --- |
| [Skill Block](#skill-block) | `skill-block` | The root `skill { }` block — every `.prompt` file must have exactly one |
| [Frontmatter Key-Value Pairs](#frontmatter) | `frontmatter` | Top-level `key: value` metadata (`name`, `description`, `license`, `version`, `include`) |
| [Header / Body Blocks](#header--body-blocks) | `header-body` | Alternative structure using `header { }` (or `head { }`) + `body { }` blocks |
| [Meta Block](#meta-block) | `meta` | Nested `meta { }` block for arbitrary key-value metadata (serialized as nested YAML) |
| [Content / Body Block](#content--body-block) | `content-body` | The `content { }` or `body { }` block where all markdown elements live |

### Headers

| Section | ID | Description |
| --- | --- | --- |
| [Headers (h1 – h6)](#headers-h1--h6) | `headers` | `h1:` through `h6:` map to `#` through `######` |
| [Header Section Braces](#header-section-braces) | `header-sections` | Headers are flat — they mark where a section begins, not wrappers |

### Text Content

| Section | ID | Description |
| --- | --- | --- |
| [Inline Paragraph (p:)](#inline-paragraph-p) | `paragraph-inline` | `p:TEXT` outputs text followed by a blank line |
| [Block Paragraph (p { })](#block-paragraph-p--) | `paragraph-block` | Multi-line paragraph block with inline formatting |
| [Same-line Paragraph (p{...})](#same-line-paragraph-p) | `paragraph-sameline` | `p{text}` extracts content between braces on the same line |

### Lists

| Section | ID | Description |
| --- | --- | --- |
| [Unordered List (ul { })](#unordered-list-ul--) | `unordered-list` | `li:` lines inside become `- Item text` |
| [Ordered List (ol { })](#ordered-list-ol--) | `ordered-list` | `li:` lines inside become numbered items |
| [Standalone li:](#standalone-li) | `standalone-li` | `li:Text` outside a list block becomes `- Text` |

### Code

| Section | ID | Description |
| --- | --- | --- |
| [Code Block (code { })](#code-block-code--) | `code-block` | Raw lines collected with brace depth tracking, output as fenced triple backticks |
| [Inline Code (code:)](#inline-code-code) | `code-inline` | Standalone `code:TEXT` wraps in backticks; inline word-capture or `code{...}` brace syntax |

### Media & Links

| Section | ID | Description |
| --- | --- | --- |
| [Image — Colon Syntax](#image--colon-syntax) | `images-colon` | `img:ALT:PATH` becomes `![ALT](PATH)` |
| [Image — Brace Syntax](#image--brace-syntax) | `images-brace` | `img{src:"path" alt:"text"}` with flexible key order and spacing |
| [Link — Colon Syntax](#link--colon-syntax) | `links-colon` | `link:DISPLAY:URL` becomes `[DISPLAY](URL)` |
| [Link — Brace Syntax](#link--brace-syntax) | `links-brace` | `link{display:"text" url:"href"}` with flexible key order |

### Inline Formatting

| Section | ID | Description |
| --- | --- | --- |
| [strong: (Word-Capture)](#strong-word-capture) | `strong-word` | Captures words until a stop word, wraps in `**...**` |
| [strong{...} (Inline Brace)](#strong-inline-brace) | `strong-brace` | `strong{text}` becomes `**text**` |
| [italic: (Word-Capture)](#italic-word-capture) | `italic-word` | Captures words until a stop word, wraps in `*...*` |
| [italic{...} (Inline Brace)](#italic-inline-brace) | `italic-brace` | `italic{text}` becomes `*text*` |
| [code: (Word-Capture, Inline)](#code-word-capture-inline) | `code-word` | Inline `code:` captures words using `\S+`, wraps in backticks |
| [code{...} (Inline Brace)](#code-inline-brace) | `code-brace` | `code{text}` becomes `` `text` `` |

### Other Elements

| Section | ID | Description |
| --- | --- | --- |
| [Blockquote](#blockquote) | `blockquote` | `blockquote:TEXT` (or `bq:TEXT`) becomes `> TEXT` |
| [Horizontal Rule](#horizontal-rule) | `hr` | A line that is exactly `hr` outputs `---` |
| [Table](#table) | `table` | `table { }` with `tr { }` rows containing `td:` / `th:` cells |

### Advanced

| Section | ID | Description |
| --- | --- | --- |
| [Include](#include) | `include` | `include: filename.md` adds an include path in frontmatter |
| [Inline Formatting Application Order](#inline-formatting-application-order) | `format-order` | Processing order: brace syntax first (`link`, `strong`, `italic`, `code`), then colon syntax |
| [Full Example](#full-example) | `full-example` | Complete `.prompt` file demonstrating many features together |
