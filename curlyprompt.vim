" Vim syntax file
" Language: Curly Prompt
" Maintainer: Auto-generated
" Latest Revision: 2026-01-14

if exists("b:current_syntax")
  finish
endif

" Comments (defined early so they take precedence)
syn match curlypromptComment "#.*$"
syn region curlypromptComment start="/\*" end="\*/"
syn match curlypromptComment "//.*$"
hi def link curlypromptComment Comment

" String literals (defined early with contains to allow escapes only)
" Double quoted strings
syn region curlypromptString start='"' end='"' skip='\\"' keepend
" Single quoted strings - only match when preceded by whitespace, start of line, or common delimiters
" This prevents matching apostrophes in contractions like "he's"
syn region curlypromptString start="\%(^\|[\s({[,=:]\)\@<='" end="'" skip="\\'" keepend
hi def link curlypromptString String

" JavaScript Control Flow and Loop keywords (keyword_style: ForestGreen #228B22, normal weight)
syn keyword curlypromptKeyword if else switch case default break continue return
syn keyword curlypromptKeyword while for do in of
syn keyword curlypromptKeyword try catch finally throw
syn keyword curlypromptKeyword async await yield
hi curlypromptKeyword cterm=NONE ctermfg=28 guifg=#228B22 gui=NONE

" Other JavaScript keywords (tag_style: ForestGreen #228B22, bold)
syn keyword curlypromptTag let const var function class extends implements
syn keyword curlypromptTag new this super static
syn keyword curlypromptTag import export from as default
syn keyword curlypromptTag typeof instanceof delete void
syn keyword curlypromptTag true false null undefined
hi curlypromptTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" Words starting with @ sign (DarkOrange #FF8C00, bold)
syn match curlypromptAtWord '@\w\+'
hi curlypromptAtWord cterm=bold ctermfg=208 guifg=#FF8C00 gui=bold

" Words ending with : sign (tag_style: ForestGreen #228B22, bold)
syn match curlypromptColonTag '\w\+:'
hi curlypromptColonTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" Tags followed by curly braces (tag_style: ForestGreen #228B22, bold)
" Matches words before { with optional content in between (e.g., newtag (abc) {)
syn match curlypromptBraceTag '\<\w\+\>\ze\s*\%(([^)]*)\)\?\s*{'
hi curlypromptBraceTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" Curly braces (curlybraces_style: DarkGoldenRod #B8860B, bold)
syn match curlypromptBrace "[{}]"
hi curlypromptBrace cterm=bold ctermfg=136 guifg=#B8860B gui=bold

let b:current_syntax = "curlyprompt"

" Enable automatic indentation (HCL-like behavior)
setlocal autoindent
setlocal smartindent
setlocal expandtab
setlocal shiftwidth=2
setlocal tabstop=2
setlocal softtabstop=2

" Indentation function for curly prompt
" All content inside curly braces should be indented at the same level
function! GetCurlyPromptIndent(lnum)
  let line = getline(a:lnum)
  let prevlnum = prevnonblank(a:lnum - 1)
  
  if prevlnum == 0
    return 0
  endif
  
  let prevline = getline(prevlnum)
  let ind = indent(prevlnum)
  
  " If current line is a closing brace, find the matching opening brace
  if line =~ '^\s*}'
    " Save cursor position
    let save_cursor = getcurpos()
    " Move cursor to the closing brace line
    call cursor(a:lnum, 1)
    " Search backwards for matching opening brace
    let openline = searchpair('{', '', '}', 'bWn', '', max([1, a:lnum - 200]))
    " Restore cursor position
    call setpos('.', save_cursor)
    
    if openline > 0
      " Return the indentation of the line containing the opening brace
      return indent(openline)
    endif
    " Fallback: dedent from previous line
    if ind >= shiftwidth()
      return ind - shiftwidth()
    endif
    return 0
  endif
  
  " If previous line opens a brace, indent next line
  if prevline =~ '{\s*$'
    return ind + shiftwidth()
  endif
  
  " If previous line closes a brace, maintain current indentation
  if prevline =~ '^\s*}'
    return ind
  endif
  
  " For lines inside braces (sentences, tags, etc.), maintain same indentation
  " This ensures all children at the same level have the same indentation
  return ind
endfunction

setlocal indentexpr=GetCurlyPromptIndent(v:lnum)

" Auto-indent when pressing Enter after opening brace in insert mode
inoremap <buffer> <expr> <CR> <SID>HandleEnterAfterBrace()

function! s:HandleEnterAfterBrace()
  let line = getline('.')
  let col = col('.') - 1
  
  " Check if cursor is right after an opening brace
  if col > 0 && line[col - 1] == '{'
    " Insert newline and let indentexpr handle indentation
    return "\<CR>"
  endif
  
  " Default: just insert newline and let indentexpr handle it
  return "\<CR>"
endfunction


