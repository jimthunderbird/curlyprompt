# Curly Prompt Vim Syntax Plugin

## Overview
Vim syntax highlighting and indentation plugin for the "curly prompt" language.

## Installation
```bash
mkdir -p ~/.vim/syntax
cp ./curlyprompt.vim ~/.vim/syntax/
```

## File Locations
- **Primary**: `./curlyprompt.vim` (in project root)
- **Installation**: `~/.vim/syntax/curlyprompt.vim` (copy for vim to use)

## Style Definitions
- **tag_style**: ForestGreen #228B22, font weight bold
- **keyword_style**: ForestGreen #228B22, font weight normal
- **curlybraces_style**: DarkGoldenRod #B8860B, font weight bold
- **atword_style**: DarkOrange #FF8C00, font weight bold

## Syntax Highlighting

### Order of Precedence
1. **Comments** (defined first): `#`, `//`, `/* */` styles
2. **Strings** (defined second with keepend):
   - Double quoted strings: standard pattern with skip for escaped quotes
   - Single quoted strings: uses lookbehind pattern `\%(^\|[\s({[,=:]\)\@<='` to only match after whitespace/start/delimiters, preventing apostrophes in contractions like "he's" from breaking syntax
3. **Keywords and tags** (defined after strings to avoid conflicts)

### Syntax Rules

#### Comments
- Line comments: `#` and `//`
- Block comments: `/* */`
- Linked to Comment highlight group
- Patterns:
  ```vim
  syn match curlypromptComment "#.*$"
  syn region curlypromptComment start="/\*" end="\*/"
  syn match curlypromptComment "//.*$"
  ```

#### Strings
- Double quoted: `start='"' end='"' skip='\\"' keepend`
- Single quoted: `start="\%(^\|[\s({[,=:]\)\@<='" end="'" skip="\\'" keepend`
- Linked to String highlight group
- Single quote pattern prevents matching apostrophes in contractions
- Patterns:
  ```vim
  syn region curlypromptString start='"' end='"' skip='\\"' keepend
  syn region curlypromptString start="\%(^\|[\s({[,=:]\)\@<='" end="'" skip="\\'" keepend
  ```

#### Keywords
- JavaScript control flow/loops: `if`, `else`, `switch`, `case`, `default`, `break`, `continue`, `return`, `while`, `for`, `do`, `in`, `of`, `try`, `catch`, `finally`, `throw`, `async`, `await`, `yield`
- Highlighted with **keyword_style** (ForestGreen #228B22, normal weight)
- Defined as `curlypromptKeyword`
- Highlight: `hi curlypromptKeyword cterm=NONE ctermfg=28 guifg=#228B22 gui=NONE`

#### Tags
- Other JavaScript keywords: `let`, `const`, `var`, `function`, `class`, `extends`, `implements`, `new`, `this`, `super`, `static`, `import`, `export`, `from`, `as`, `default`, `typeof`, `instanceof`, `delete`, `void`, `true`, `false`, `null`, `undefined`
- Highlighted with **tag_style** (ForestGreen #228B22, bold)
- Defined as `curlypromptTag`
- Highlight: `hi curlypromptTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold`

#### Special Patterns
- **At-words** (`@word`): pattern `@\w\+`, highlighted with **atword_style** (DarkOrange #FF8C00, bold) (`curlypromptAtWord`)
  ```vim
  syn match curlypromptAtWord '@\w\+'
  hi curlypromptAtWord cterm=bold ctermfg=208 guifg=#FF8C00 gui=bold
  ```
- **Colon-tags** (`word:`): pattern `\v<\w+(\.\w+)*:`, supports dots in tag names (e.g., `a.b.c:`), highlighted with **tag_style** (`curlypromptColonTag`)
  ```vim
  syn match curlypromptColonTag '\v<\w+(\.\w+)*:'
  hi curlypromptColonTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold
  ```
- **Brace-tags** (`word {`): pattern `\v<\w+(\.\w+)*>\ze\s*(\([^)]*\))?\s*\{`, supports optional parentheses content and dots in tag names (e.g., `a.b.c {`), highlighted with **tag_style** (`curlypromptBraceTag`)
  ```vim
  syn match curlypromptBraceTag '\v<\w+(\.\w+)*>\ze\s*(\([^)]*\))?\s*\{'
  hi curlypromptBraceTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold
  ```

#### Braces
- Pattern: `[{}]`
- Highlighted with **curlybraces_style** (DarkGoldenRod #B8860B, bold)
- Defined as `curlypromptBrace`
- Patterns:
  ```vim
  syn match curlypromptBrace "[{}]"
  hi curlypromptBrace cterm=bold ctermfg=136 guifg=#B8860B gui=bold
  ```

## Indentation

### Mechanism
Custom indentexpr using `GetCurlyPromptIndent()` function

### Behavior
- HCL-like automatic indentation
- All content inside curly braces indented at same level
- Closing braces aligned with opening tag line (matching indentation)
- Auto-indent when pressing Enter after opening brace in insert mode

### Algorithm

#### Closing Brace Lines
1. Save cursor position with `getcurpos()`
2. Move cursor to closing brace line with `cursor(a:lnum, 1)`
3. Use `searchpair('{', '', '}', 'bWn', '', max([1, a:lnum - 200]))` to find matching opening brace
4. Restore cursor position with `setpos('.', save_cursor)`
5. Return indentation of the line containing opening brace using `indent(openline)`
6. Fallback: dedent by shiftwidth if searchpair fails

#### After Opening Brace
- If previous line ends with `{\s*$`, indent by shiftwidth
- Pattern: `prevline =~ '{\s*$'`
- Action: `return ind + shiftwidth()`

#### After Closing Brace
- If previous line closes a brace, maintain current indentation
- Pattern: `prevline =~ '^\s*}'`
- Action: `return ind`

#### Other Lines
- Maintain current indentation level
- Ensures all children at same level have same indentation
- Action: `return ind`

### Settings
```vim
setlocal autoindent
setlocal smartindent
setlocal expandtab
setlocal shiftwidth=2
setlocal tabstop=2
setlocal softtabstop=2
setlocal indentexpr=GetCurlyPromptIndent(v:lnum)
```

### Insert Mode Mappings
- `inoremap <buffer> <expr> <CR> <SID>HandleEnterAfterBrace()`
- When Enter is pressed after `{`, inserts newline and lets indentexpr handle indentation automatically
- Implementation checks if cursor is right after `{` using: `line[col - 1] == '{'`
- Returns `"\<CR>"` in all cases to trigger automatic indentation
- Function `s:HandleEnterAfterBrace()` handles the logic

## Features Removed
- **Folding support**: Removed all foldmethod, foldexpr, and folding-related code
- **XML tag support**: Removed all XML/HTML tag syntax patterns and highlighting
- **Reason**: Simplification and focus on core curly-brace syntax

## Known Fixes Applied

### Single Quotes in Contractions Break Syntax Highlighting
- **Solution**: Use lookbehind pattern `\%(^\|[\s({[,=:]\)\@<='` to only match single quotes preceded by whitespace, start of line, or common delimiters. This prevents apostrophes in "he's", "don't", etc. from being treated as string delimiters.
- **Status**: Fixed

### Closing Braces Don't Align with Opening Tag
- **Solution**: Use `searchpair('{', '', '}', 'bWn')` in `GetCurlyPromptIndent()` to find matching opening brace and return its indentation level. Search backwards up to 200 lines for performance.
- **Status**: Fixed

### XML Tags Breaking Syntax Highlighting
- **Solution**: Removed all XML tag support completely
- **Status**: Fixed by removal

### Folding Not Working
- **Solution**: Removed all folding support
- **Status**: Fixed by removal

### Tags with Dots Not Highlighted
- **Solution**: Changed regex patterns to use very magic mode `\v` with pattern `\w+(\.\w+)*` which matches word followed by zero or more dot-word sequences. This properly supports tags like `a.b.c {` and `a.b.c:`
- **Status**: Fixed
- **Date**: 2026-01-16

## Requirements
- Inside curly braces, all sentences and child tags should have the same indentation, similar to HCL indentation
- The closing bracket should have the same indentation as the parent tag
- All words starting with `@` sign should be highlighted in **atword_style** (DarkOrange #FF8C00, bold)
- All words ending with `:` sign should be highlighted in **tag_style**
- All Control Flow and Loops keywords in JavaScript should be highlighted in **keyword_style**
- Other keywords in JavaScript should be highlighted in **tag_style**

## Version
- Latest Revision: 2026-01-16
- Status: All features working, XML support removed, folding removed, dots in tag names supported
