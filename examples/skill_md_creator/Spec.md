# Spec: CurlyPrompt-to-SKILL Markdown Converter — Feature List

`action.js` is a Node.js CLI tool that converts CurlyPrompt DSL (`.prompt` files) into SKILL Markdown (`.md` files). Invocation: `node action.js <source.prompt> <target.md>`.

---

## Features

1. **Root `skill { }` block** — Every `.prompt` file must contain exactly one `skill { }` block. All content outside it is ignored.

2. **Flat frontmatter key-value pairs** — Before `content {`, keys like `name`, `description`, `license`, `version`, and `include` are parsed as `key: value`. Double quotes around values are stripped.

3. **Explicit `header { }` / `head { }` block** — An alternative to flat frontmatter. Groups frontmatter keys inside `header { }` (or alias `head { }`). Paired with `body { }` for content.

4. **`body { }` as alias for `content { }`** — The content block can be delimited by either `content { }` or `body { }`.

5. **`meta { }` nested block** — Arbitrary key-value metadata inside frontmatter. Each line is `key: value`. Quotes stripped. Can appear inside `header { }` or at the flat frontmatter level. Serialized as nested YAML in output.

6. **YAML frontmatter output** — Output starts with `---` delimited YAML frontmatter. Keys appear in source order. A blank line follows the closing `---`.

7. **Headers (`h1:` through `h6:`)** — `h1:Title` becomes `# Title`, `h2:` becomes `##`, `h3:` becomes `###`, `h4:` becomes `####`, `h5:` becomes `#####`, `h6:` becomes `######`. Each header is followed by a blank line. Inline formatting is applied to header text.

8. **Header section braces (`h1:Title {`)** — When a header line ends with `{`, the `{` is stripped from the title. The matching closing `}` is silently consumed. This is structural grouping only — no effect on Markdown indentation.

9. **Inline paragraph (`p:TEXT`)** — `p:This is text.` outputs `This is text.` followed by a blank line. Inline formatting is applied.

10. **Block paragraph (`p { }`)** — Multi-line paragraph block. Each non-empty line inside is emitted with inline formatting. One trailing blank line after the block. Empty lines within are skipped.

11. **Same-line paragraph (`p{TEXT}`)** — `p{text here}` extracts content between `p{` and `}` on the same line. Emitted as a paragraph with inline formatting and a trailing blank line.

12. **Unordered list (`ul { }`)** — Contains `li:` prefixed lines. Each becomes `- Item text`. Non-`li:` lines are ignored. Inline formatting applied. Trailing blank line after the list.

13. **Ordered list (`ol { }`)** — Contains `li:` prefixed lines. Numbered starting at 1: `1. Item`, `2. Item`, etc. Inline formatting applied. Trailing blank line after the list.

14. **Standalone list item (`li:`)** — `li:Text` outside a list block becomes `- Text`. Inline formatting applied. No trailing blank line.

15. **Code block (`code { }`)** — Lines inside are collected raw. Common leading whitespace is stripped. Brace depth tracking ensures inner `{`/`}` don't close the block prematurely. Output uses fenced triple backticks with no language specifier. Trailing blank line.

16. **Code block brace depth tracking** — Starts at depth 1. A line that is exactly `}` (trimmed) decrements depth; depth 0 ends the block. Otherwise, `{` and `}` characters in the line adjust depth.

17. **Standalone inline code (`code:TEXT`)** — `code:docker build` as a standalone line wraps text in backticks and appends a blank line.

18. **Blockquote (`blockquote:TEXT`)** — `blockquote:Note here` becomes `> Note here`. Inline formatting applied. Trailing blank line.

19. **Horizontal rule (`hr`)** — A line that is exactly `hr` outputs `---` followed by a blank line.

20. **Image colon syntax (`img:ALT:PATH`)** — `img:Docker Arch:docs/arch.png` becomes `![Docker Arch](docs/arch.png)`. First `:` after `img:` separates alt from path. Trailing blank line.

21. **Image brace syntax (`img{src:"URL" alt:"ALT"}`)** — One-line brace form with `src` and `alt` key-value pairs. Key order doesn't matter. Values are double-quoted. Commas, spaces, or both can separate pairs. Spacing between `img` and `{` is flexible (`img{`, `img {`, `img   {` all work). Trailing blank line.

22. **Inline link (`link:DISPLAY:URL`)** — `link:Google:https://www.google.com` becomes `[Google](https://www.google.com)`. URL must start with `http://` or `https://`. Regex: `link:(.+?):(https?:\/\/\S+)`.

22b. **Inline link brace syntax (`link{display:"TEXT" url:"URL"}`)** — One-line brace form with `display` and `url` key-value pairs. Key order doesn't matter. Values are double-quoted. Commas, spaces, or both can separate pairs. Spacing between `link` and `{` is flexible (`link{`, `link {`, `link   {` all work). Processed before the colon syntax in `processFormatting()`.

23. **Inline `strong{...}`** — `strong{important text}` becomes `**important text**`. Same-line brace form.

24. **Inline `italic{...}`** — `italic{key concept}` becomes `*key concept*`. Same-line brace form.

25. **Word-capture `strong:WORDS`** — Captures one or more words after `strong:` using `[\w.]+` (with optional hyphenated parts). Capture stops before a stop word. E.g., `strong:bold text and more` → `**bold text** and more`. Stop words: `to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an, instruction, token, supported, setup, requests, mock, approach, function, word, text, specification, element, steps, style, content, authentication, inside, guide, mode, scripts, paragraph`.

26. **Word-capture `italic:WORDS`** — Same mechanics as `strong:` but wraps in `*...*`. Stop words: `to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an, text, information, reviewers`.

27. **Word-capture `code:WORDS` (inline)** — Same mechanics but uses `\S+` for tokens (allowing special characters). Wraps in backticks. Stop words: `to, for, in, with, and, or, within, from, by, at, on, of, as, the, is, are, a, an, parameters, branch, prefix`.

28. **Inline formatting application order** — `processFormatting(text)` applies transforms in this exact order: (1) `link{...}` brace syntax, (2) `link:` colon syntax, (3) `strong{...}`, (4) `italic{...}`, (5) `strong:`, (6) `italic:`, (7) `code:`. Applied to headers, paragraphs, list items, and blockquotes.

29. **Content block brace depth tracking** — When entering `content { }` or `body { }`, lines are collected using brace depth tracking (same rules as code blocks) to handle nested section braces.

30. **Element processing dispatch order** — Lines are matched in priority order: (1) skip empty/`}` lines, (2) headers, (3) `p{...}`, (4) `p {`, (5) `p:`, (6) `ul {`, (7) `ol {`, (8) `code {`, (9) `blockquote:`, (10) `hr`, (11) `img:`, (12) `table {`, (13) `li:`, (14) `code:`.

31. **`include` frontmatter key** — `include: global-restriction.md` adds an include path to the frontmatter. Quotes stripped.

32. **Quote stripping on all frontmatter values** — All double quotes in frontmatter values are removed. Both `name: "My Skill"` and `name: My Skill` produce the same output.

33. **Trailing newline** — The output file always ends with exactly one trailing `\n`.

34. **Synchronous file I/O** — Uses `fs.readFileSync` (UTF-8) for reading and `fs.writeFileSync` for writing. No async patterns.

35. **Table (`table { }`)** — Contains `tr { }` row blocks, each containing `td:` (data) or `th:` (header) cell lines. The first row is always used as the header row in Markdown output (whether it uses `th:` or `td:`). A `| --- | ... |` separator is emitted after the header row. Remaining rows are emitted as data rows. Cells support inline formatting via `processFormatting()`. Trailing blank line after the table.

36. **CLI interface** — `process.argv[2]` is the source file, `process.argv[3]` is the target file. Fewer than 4 arguments causes silent exit. No flags or `--help`.

37. **Static `Converter` class** — Exports a single static class with methods: `convertCurlyPromptToSKILL(source, target)`, `parseFrontmatterLine(...)`, `processFormatting(text)`, `processContentLines(lines, output)`.

38. **Zero dependencies** — Uses only the built-in `fs` module. No npm packages required.
