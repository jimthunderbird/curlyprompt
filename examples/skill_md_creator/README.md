# CurlyPrompt Language Tutorial

Reference for all sections covered in [`tutorial/index.html`](tutorial/index.html).

## Usage

```
node spec/convert.js SKILL.prompt SKILL.md
```

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
| [Inline Code (code:)](#inline-code-code) | `code-inline` | Standalone `code:TEXT` wraps in backticks; inline end-of-line capture or `code{...}` brace syntax |

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
| [strong: (End of Line)](#strong-end-of-line) | `strong-word` | Captures everything to end of line, wraps in `**...**` |
| [strong{...} (Inline Brace)](#strong-inline-brace) | `strong-brace` | `strong{text}` becomes `**text**` |
| [italic: (End of Line)](#italic-end-of-line) | `italic-word` | Captures everything to end of line, wraps in `*...*` |
| [italic{...} (Inline Brace)](#italic-inline-brace) | `italic-brace` | `italic{text}` becomes `*text*` |
| [code: (End of Line, Inline)](#code-end-of-line-inline) | `code-word` | Inline `code:` captures everything to end of line, wraps in backticks |
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

---

## Skill Block

Every `.prompt` file must contain exactly one `skill { }` block. All content outside it is ignored.

```
skill {
  name: "My Skill"
  description: "A helpful skill"
  content {
    h1:Hello World
    p:Welcome to CurlyPrompt.
  }
}
```

**Output:**

```markdown
---
name: My Skill
description: A helpful skill
---

# Hello World

Welcome to CurlyPrompt.
```

## Frontmatter

Top-level `key: value` metadata before the `content {` block. Quotes around values are automatically stripped.

```
skill {
  name: "Simple Skill"
  description: "A simple skill for AI Agent"
  license: "MIT"
  version: "1.0"
  content {
    h1:Hello
  }
}
```

**Output:**

```markdown
---
name: Simple Skill
description: A simple skill for AI Agent
license: MIT
version: 1.0
---

# Hello
```

> **Tip:** Quotes are optional — both `name: "My Skill"` and `name: My Skill` produce the same output.

## Header / Body Blocks

Group metadata inside a `header { }` (or `head { }`) block, paired with `body { }` for content.

```
skill {
  header {
    name: Simple Header Test
    description: Testing header/body
    version: 2.0
  }
  body {
    h1:Getting Started
    p:follow these steps to begin
  }
}
```

**Output:**

```markdown
---
name: Simple Header Test
description: Testing header/body
version: 2.0
---

# Getting Started

follow these steps to begin
```

> **Tip:** `head { }` is an exact alias for `header { }`.

## Meta Block

The `meta { }` block holds arbitrary key-value metadata, serialized as nested YAML.

```
skill {
  name: Multi Meta Test
  description: Test meta attributes
  license: MIT
  meta {
    author: John Doe
    category: utilities
    platform: cross-platform
    priority: high
  }
  content {
    h1:Overview
    p:multi-platform tool
  }
}
```

**Output:**

```markdown
---
name: Multi Meta Test
description: Test meta attributes
license: MIT
meta:
  author: John Doe
  category: utilities
  platform: cross-platform
  priority: high
---

# Overview

multi-platform tool
```

## Content / Body Block

The content block can be `content { }` or `body { }`. When using `header { }`, pair it with `body { }`. When using flat frontmatter, use `content { }`. Both work identically.

## Headers (h1 – h6)

`h1:` through `h6:` map to `#` through `######`. Inline formatting is applied to header text.

```
h1:Main Title
h2:Section Two
h3:Section Three
h4:Section Four
h5:Section Five
h6:Section Six

h2:very strong:important steps
h3:also strong:important:
```

**Output:**

```markdown
# Main Title

## Section Two

### Section Three

#### Section Four

##### Section Five

###### Section Six

## very **important steps**

### also **important:**
```

## Header Section Braces

Headers are flat — they mark where a section begins, not wrappers.

```
h1:Instruction
p:this is a very strong:important instruction
ul {
  li:step 1
  li:step 2
  li:step 3
}

h2:some more paragraph
```

**Output:**

```markdown
# Instruction

this is a very **important instruction**

- step 1
- step 2
- step 3

## some more paragraph
```

## Inline Paragraph (p:)

`p:TEXT` outputs text followed by a blank line. Inline formatting is applied.

```
p:This is a simple paragraph.
p:Use code:npm install to set up.
```

**Output:**

```markdown
This is a simple paragraph.

Use `npm install to set up.`
```

## Block Paragraph (p { })

Multi-line paragraph block. Each non-empty line is emitted with inline formatting.

```
p {
  use italic{emphasis} when highlighting
  and strong{bold} for critical warnings
}
```

**Output:**

```markdown
use *emphasis* when highlighting
and **bold** for critical warnings
```

## Same-line Paragraph (p{...})

`p{text}` extracts content between braces on the same line.

```
p{this is a same-line paragraph}
p{another with strong{important} info}
```

**Output:**

```markdown
this is a same-line paragraph

another with **important** info
```

## Unordered List (ul { })

`li:` lines inside become `- Item text`. Inline formatting is applied.

```
ul {
  li:Docker Engine installed
  li:Docker Compose installed
  li:Access to container registry
}
```

**Output:**

```markdown
- Docker Engine installed
- Docker Compose installed
- Access to container registry
```

## Ordered List (ol { })

`li:` lines inside become numbered items. Inline formatting is applied.

```
ol {
  li:strong:Build - Compile source code
  li:strong:Test - Run unit tests
  li:strong:Deploy - Push to production
}
```

**Output:**

```markdown
1. **Build** - Compile source code
2. **Test** - Run unit tests
3. **Deploy** - Push to production
```

## Standalone li:

`li:Text` outside a list block becomes `- Text`.

```
li:standalone item outside a list
```

**Output:**

```markdown
- standalone item outside a list
```

## Code Block (code { })

Raw lines collected with brace depth tracking. Output as fenced triple backticks.

```
code {
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  CMD ["node", "server.js"]
}
```

**Output:**

````markdown
```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```
````

**Brace depth tracking** — inner `{` / `}` don't close the block prematurely:

```
code {
  exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name');
    });
  };
}
```

**Output:**

````markdown
```
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name');
  });
};
```
````

## Inline Code (code:)

Standalone `code:TEXT` wraps text in backticks and appends a blank line. Inline `code:` captures to end of line. `code{...}` brace syntax for precise control.

```
code: npx knex migrate:make name

p:Use code:npm install to set up.

p:use code{docker build} to build the image
p:run code{npm install} and then code{npm start}
```

**Output:**

```markdown
`npx knex migrate:make name`

Use `npm install to set up.`

use `docker build` to build the image

run `npm install` and then `npm start`
```

## Image — Colon Syntax

`img:ALT:PATH` becomes `![ALT](PATH)`.

```
img:Main Dashboard:screenshots/dashboard.png
img:Docker Architecture:docs/docker-arch.png
```

**Output:**

```markdown
![Main Dashboard](screenshots/dashboard.png)

![Docker Architecture](docs/docker-arch.png)
```

## Image — Brace Syntax

`img{src:"path" alt:"text"}` with flexible key order and spacing.

```
img{src:"photo.jpg",alt:"a photo"}
img{ src:"logo.svg" alt:"company logo"}
img{alt:"reverse" src:"reverse.png"}
img   {src:"spaced.jpg" alt:"space"}
```

**Output:**

```markdown
![a photo](photo.jpg)

![company logo](logo.svg)

![reverse](reverse.png)

![space](spaced.jpg)
```

## Link — Colon Syntax

`link:DISPLAY:URL` becomes `[DISPLAY](URL)`.

```
p:Visit link:Google:https://www.google.com for searching.
p:See link:rate limit docs:https://api.example.com/docs for details.
```

**Output:**

```markdown
Visit [Google](https://www.google.com) for searching.

See [rate limit docs](https://api.example.com/docs) for details.
```

## Link — Brace Syntax

`link{display:"text" url:"href"}` with flexible key order.

```
p:Visit link{display:"Google" url:"https://www.google.com"} for searching.
p:Go to link  {display:"Docs" url:"https://docs.example.com"} for help.
```

**Output:**

```markdown
Visit [Google](https://www.google.com) for searching.

Go to [Docs](https://docs.example.com) for help.
```

## strong: (End of Line)

`strong:` captures everything from the colon to the end of the current line and wraps it in `**...**`. Use `strong{...}` brace syntax for fine-grained control over which words are bolded.

```
p:this is a very strong:important instruction
p:Use strong:conventional commits with format
li:strong:Nullable: disabled
```

**Output:**

```markdown
this is a very **important instruction**

Use **conventional commits with format**

- **Nullable: disabled**
```

> **Tip:** `strong:` captures everything to the end of the current line. Use `strong{...}` brace syntax when you need to bold only specific words in the middle of a line.

## strong{...} (Inline Brace)

`strong{text}` becomes `**text**`.

```
p:strong{this is very important}, rest is ok
p:read the strong{critical section} before proceeding
```

**Output:**

```markdown
**this is very important**, rest is ok

read the **critical section** before proceeding
```

## italic: (End of Line)

`italic:` works like `strong:` but wraps in `*...*`. Captures everything to the end of the current line. Use `italic{...}` brace syntax for fine-grained control.

```
p:This is italic:important and critical
p:Keep migrations italic:small and focused
```

**Output:**

```markdown
This is *important and critical*

Keep migrations *small and focused*
```

## italic{...} (Inline Brace)

`italic{text}` becomes `*text*`.

```
p:the italic{key concept} is explained below
h5:Italic italic{styled} h5
```

**Output:**

```markdown
the *key concept* is explained below

##### Italic *styled* h5
```

## code: (End of Line, Inline)

When used inline (not as a standalone element), `code:` captures everything to the end of the current line and wraps in backticks. Use `code{...}` brace syntax for fine-grained control.

```
p:Use code:npm install to install packages.
ul {
  li:code:docker build -t myapp .
  li:code:docker compose up -d
}
```

**Output:**

```markdown
Use `npm install to install packages.`

- `docker build -t myapp .`
- `docker compose up -d`
```

## code{...} (Inline Brace)

`code{text}` becomes `` `text` ``.

```
p:use code{docker build} to build the image
p:run code{npm install} and then code{npm start} to get started
p:combine strong{important} with code{run.sh} in one line
```

**Output:**

```markdown
use `docker build` to build the image

run `npm install` and then `npm start` to get started

combine **important** with `run.sh` in one line
```

> **Tip:** Use `code{...}` for precise control over what gets wrapped in backticks. Use `code:` when you want everything to end of line in backticks.

## Blockquote

`blockquote:TEXT` (or `bq:TEXT`) becomes `> TEXT`. Inline formatting is applied.

```
blockquote:This is a very important quote.
bq:Short alias works the same way.
blockquote:Another with strong:bold content inside.
```

**Output:**

```markdown
> This is a very important quote.

> Short alias works the same way.

> Another with **bold** content inside.
```

> **Tip:** `bq:` is an exact alias for `blockquote:`.

## Horizontal Rule

A line that is exactly `hr` outputs `---`.

```
h1:Section One
p:Content in section one.
hr
h1:Section Two
p:Content in section two.
```

**Output:**

```markdown
# Section One

Content in section one.

---

# Section Two

Content in section two.
```

## Table

`table { }` with `tr { }` rows containing `td:` / `th:` cells. First row becomes the header.

```
table {
  tr {
    td: Name
    td: Age
    td: City
  }
  tr {
    td: Alice
    td: 30
    td: New York
  }
  tr {
    td: Bob
    td: 25
    td: London
  }
}
```

**Output:**

```markdown
| Name | Age | City |
| --- | --- | --- |
| Alice | 30 | New York |
| Bob | 25 | London |
```

## Include

`include: filename.md` adds an include path in frontmatter.

```
skill {
  name: "Include Test"
  description: "Test include keyword"
  include: global-restriction.md
  content {
    h1:Getting Started
    p:follow the instructions below
  }
}
```

**Output:**

```markdown
---
name: Include Test
description: Test include keyword
include: global-restriction.md
---

# Getting Started

follow the instructions below
```

## Inline Formatting Application Order

The `processFormatting(text)` function applies transforms in this order:

1. `link{...}` — brace syntax links
2. `link:` — colon syntax links
3. `strong{...}` — brace syntax bold
4. `italic{...}` — brace syntax italics
5. `code{...}` — brace syntax inline code
6. `strong:` — end-of-line bold
7. `italic:` — end-of-line italics
8. `code:` — end-of-line inline code

> **Tip:** Brace syntax is always processed before colon syntax.

## Full Example

A complete `.prompt` file using many features together:

```
skill {
  name: "REST API Guide"
  description: "API documentation"
  license: "MIT"
  version: "3.1"
  content {
    h1:API Documentation {
      p:This describes the REST API.

      h2:Authentication
      p:Requires a strong:Bearer token.
      blockquote:Tokens expire after 24h.

      h2:Endpoints {
        h3:Get All Users
        p:code:GET /api/users
        ul {
          li:Returns a list of all users
          li:Supports code{page} and code{limit} parameters
        }

        h3:Create User
        p:code:POST /api/users
        p:Request body:
        code {
          {
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      }

      h2:Rate Limiting
      p:Limited to strong:100 requests per minute.
      p:See link:docs:https://api.example.com/docs for details.
    }
  }
}
```

**Output:**

```markdown
---
name: REST API Guide
description: API documentation
license: MIT
version: 3.1
---

# API Documentation

This describes the REST API.

## Authentication

Requires a **Bearer token.**

> Tokens expire after 24h.

## Endpoints

### Get All Users

`GET /api/users`

- Returns a list of all users
- Supports `page` and `limit` parameters

### Create User

`POST /api/users`

Request body:

```
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Rate Limiting

Limited to **100 requests per minute.**

See [docs](https://api.example.com/docs) for details.
```
