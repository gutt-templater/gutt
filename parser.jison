%lex

%%
[\s\n\t]+                   return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b        return 'TK_NUMBER';
[a-zA-Z]+([a-zA-Z0-9]+)?\b  return 'TK_WORD';
[:]                         return 'TK_COLON';
\<\!\-\-                    return 'TK_COMMENT_OPEN';
\-\-\>                      return 'TK_COMMENT_CLOSE';
\-                          return 'TK_DASH';
[^\<\>\-\:a-zA-Z0-9]+       return 'TK_OTHER';
<<EOF>>                     return 'EOF';

/lex

%start document

%%

document
  : first_nodes space EOF
    { console.log('This is the first nodes!', $1); }
  ;

first_nodes
  : TK_NUMBER
  | tag_name
  | comment
  ;

word
  : TK_WORD
  ;

tag_name
  : word
  | word TK_COLON word
    { $$ = $1 + $2 + $3; }
  ;

comment
  : TK_COMMENT_OPEN text TK_COMMENT_CLOSE
    { $$ = $1 + $2 + $3; }
  ;

space
  :
  | TK_SPACE
  ;

text
  : text_element
  | text text_element
    { $$ = $1 + $2; }
  ;

text_element
  : TK_SPACE
  | TK_NUMBER
  | TK_WORD
  | TK_COLON
  | TK_DASH
  | TK_OTHER
  ;
