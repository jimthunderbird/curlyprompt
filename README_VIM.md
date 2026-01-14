# Curly Prompt Vim Syntax Highlighting

This directory contains a Vim syntax highlighting file for the "Curly Prompt" programming language.

## Features

The syntax highlighter provides:
- **Bold green** highlighting for tag names before curly braces (e.g., `abc {`, `efg {`)
- **Bold green** highlighting for tag names followed by colons (e.g., `myobjective:`)
- **Green** highlighting for the `let` keyword
- **Wheat color** highlighting for curly braces `{}`
- String literal highlighting for quoted text

## Installation

### Method 1: Manual Installation

1. Create the syntax directory if it doesn't exist:
   ```bash
   mkdir -p ~/.vim/syntax
   ```

2. Copy the syntax file:
   ```bash
   cp curlyprompt.vim ~/.vim/syntax/
   ```

3. Create or edit your filetype detection file:
   ```bash
   mkdir -p ~/.vim/ftdetect
   echo 'au BufRead,BufNewFile *.curly set filetype=curlyprompt' > ~/.vim/ftdetect/curlyprompt.vim
   ```

### Method 2: Using Vim's Runtime Path

1. Create the necessary directories:
   ```bash
   mkdir -p ~/.vim/syntax ~/.vim/ftdetect
   ```

2. Copy the syntax file:
   ```bash
   cp curlyprompt.vim ~/.vim/syntax/
   ```

3. Create the filetype detection file:
   ```bash
   cat > ~/.vim/ftdetect/curlyprompt.vim << 'EOF'
   au BufRead,BufNewFile *.curly set filetype=curlyprompt
   EOF
   ```

### Method 3: For Neovim Users

1. Create the necessary directories:
   ```bash
   mkdir -p ~/.config/nvim/syntax ~/.config/nvim/ftdetect
   ```

2. Copy the syntax file:
   ```bash
   cp curlyprompt.vim ~/.config/nvim/syntax/
   ```

3. Create the filetype detection file:
   ```bash
   cat > ~/.config/nvim/ftdetect/curlyprompt.vim << 'EOF'
   au BufRead,BufNewFile *.curly set filetype=curlyprompt
   EOF
   ```

## Usage

1. Open any file with the `.curly` extension in Vim/Neovim
2. The syntax highlighting will be automatically applied

Alternatively, you can manually set the filetype for any file:
```vim
:set filetype=curlyprompt
```

## Testing

Create a test file `test.curly` with the following content:

```
abc {
  let numbers = (generate a list of random numbers)
  efg {
    perform task 1
    perform task 2
  }
}

myobjective: "some objective"
myownspec {
  let numbers = (generate a list of random numbers)
  efg {
    perform task 1
    perform task 2
  }
}
```

Open it in Vim to see the syntax highlighting in action:
```bash
vim test.curly
```

## Color Customization

If you want to customize the colors, edit `~/.vim/syntax/curlyprompt.vim` and modify the highlight definitions:

- `curlypromptBraceTag` - tags before curly braces (currently bold green)
- `curlypromptColonTag` - tags with colons (currently bold green)
- `curlypromptKeyword` - the `let` keyword (currently green)
- `curlypromptBrace` - curly braces (currently wheat/tan color)

## Troubleshooting

- Make sure syntax highlighting is enabled in Vim: `:syntax on`
- Verify the filetype is set correctly: `:set filetype?`
- Check if the syntax file is loaded: `:scriptnames`
