" Vim syntax file
" Language: Curly Prompt
" Maintainer: Auto-generated
" Latest Revision: 2026-01-14

if exists("b:current_syntax")
  finish
endif

" Keywords - 'let' for variable initialization (normal font, dark sea green)
syn keyword curlypromptKeyword let
hi curlypromptKeyword ctermfg=29 guifg=#00875f

" Curly braces (normal font, wheat color)
syn match curlypromptBrace "[{}]"
hi curlypromptBrace ctermfg=180 guifg=#d7af87

" Tags followed by colon (e.g., myobjective:) - bold dark sea green
syn match curlypromptColonTag '\w\+\ze:\s*"' 
hi curlypromptColonTag cterm=bold ctermfg=29 guifg=#00875f gui=bold

" Tags at the beginning of curly braces (e.g., abc {, efg {) - bold dark sea green
syn match curlypromptBraceTag '\<\w\+\>\ze\s*{'
hi curlypromptBraceTag cterm=bold ctermfg=29 guifg=#00875f gui=bold

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

" Enable automatic indentation
setlocal autoindent
setlocal smartindent
setlocal expandtab
setlocal shiftwidth=2
setlocal tabstop=2
