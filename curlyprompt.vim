" Vim syntax file
" Language: Curly Prompt
" Maintainer: Auto-generated
" Latest Revision: 2026-01-14

if exists("b:current_syntax")
  finish
endif

" JavaScript Control Flow and Loop keywords (DarkOliveGreen #556B2F, bold)
syn keyword curlypromptKeyword if else switch case default break continue return
syn keyword curlypromptKeyword while for do in of
syn keyword curlypromptKeyword try catch finally throw
syn keyword curlypromptKeyword async await yield
hi curlypromptKeyword cterm=bold ctermfg=100 guifg=#556B2F gui=bold

" Other JavaScript keywords (ForestGreen #228B22, bold)
syn keyword curlypromptTag let const var function class extends implements
syn keyword curlypromptTag new this super static
syn keyword curlypromptTag import export from as default
syn keyword curlypromptTag typeof instanceof delete void
syn keyword curlypromptTag true false null undefined
hi curlypromptTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" Words starting with @ sign (DarkOliveGreen #556B2F, bold)
syn match curlypromptAtWord '@\w\+'
hi curlypromptAtWord cterm=bold ctermfg=100 guifg=#556B2F gui=bold

" Curly braces (DarkGoldenRod #B8860B, bold)
syn match curlypromptBrace "[{}]"
hi curlypromptBrace cterm=bold ctermfg=136 guifg=#B8860B gui=bold

" Tags followed by colon (e.g., myobjective:) - ForestGreen #228B22, bold
syn match curlypromptColonTag '\w\+\ze:\s*"' 
hi curlypromptColonTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" Tags at the beginning of curly braces (e.g., abc {, efg {) - ForestGreen #228B22, bold
syn match curlypromptBraceTag '\<\w\+\>\ze\s*{'
hi curlypromptBraceTag cterm=bold ctermfg=28 guifg=#228B22 gui=bold

" String literals
syn region curlypromptString start='"' end='"' skip='\\"'
hi def link curlypromptString String

" Parentheses expressions
syn region curlypromptParen start='(' end=')' contains=ALL
hi def link curlypromptParen Normal

" Comments (optional, for future use)
syn match curlypromptComment "#.*$"
hi def link curlypromptComment Comment

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
  
  " If previous line opens a brace, indent next line
  if prevline =~ '{\s*$'
    return ind + shiftwidth()
  endif
  
  " If current line closes a brace, unindent
  if line =~ '^\s*}'
    return ind - shiftwidth()
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
