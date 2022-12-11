@builtin "number.ne"
@builtin "whitespace.ne"

MAIN -> PHRASE WORDSEP:*

PARENTHESES[X] -> "(" $X ")" 
BRACKETS[X] -> "["  $X "]"
BRACES[X] -> "{" $X "}"

PHRASE -> PARENTHESES[WORD] | BRACKETS[WORD] | BRACES[WORD] | WORD

WORD -> [a-z]:+ MODIFIER:?

MODIFIER -> ":" decimal

WORDSEP -> "," _