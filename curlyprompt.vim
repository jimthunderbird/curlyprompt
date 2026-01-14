" Vim syntax file
" Language: Curly Prompt
" Maintainer: Auto-generated
" Latest Revision: 2026-01-14

if exists("b:current_syntax")
  finish
endif

" Keywords
syn keyword curlypromptKeyword let
hi def link curlypromptKeyword Identifier

" Curly braces
syn match curlypromptBrace "[{}]"
hi curlypromptBrace ctermfg=180 guifg=#d4bc7d

" Tags followed by colon (e.g., myobjective:)
syn match curlypromptColonTag "\w\+\s*:" contains=curlypromptColon
hi curlypromptColonTag cterm=bold ctermfg=green gui=bold guifg=#00ff00

" Tags at the beginning of curly braces (e.g., abc {, efg {)
syn match curlypromptBraceTag "\w\+\s*{" contains=curlypromptBrace
hi curlypromptBraceTag cterm=bold ctermfg=green gui=bold guifg=#00ff00

" String literals
syn region curlypromptString start='"' end='"' 
hi def link curlypromptString String

" Parentheses expressions
syn region curlypromptParen start='(' end=')'
hi def link curlypromptParen Normal

" Comments (optional, for future use)
syn match curlypromptComment "#.*$"
hi def link curlypromptComment Comment

let b:current_syntax = "curlyprompt"
