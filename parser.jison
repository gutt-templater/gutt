%lex

%%
[\s\n\t]+                   return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b        return 'TK_NUMBER';
[a-zA-Z]+([a-zA-Z0-9]+)?\b  return 'TK_WORD';
[:]                         return 'TK_COLON';
\<\!\-\-                    return 'TK_COMMENT_OPEN';
\-\-\>                      return 'TK_COMMENT_CLOSE';
\-                          return 'TK_DASH';
\<                          return 'TK_BROKEN_BRACKET_OPEN';
\>                          return 'TK_BROKEN_BRACKET_CLOSE';
\'                          return 'TK_SINGLE_QUOTE';
\"                          return 'TK_DOUBLE_QUOTE';
\/                          return 'TK_SLASH';
[^\<\>\-\:\/a-zA-Z0-9]+     return 'TK_OTHER';
<<EOF>>                     return 'EOF';

/lex

%start document

%%

document
  : first_nodes space EOF
    { console.log('This is the first nodes!', $1); }
  ;

first_nodes
  : first_node
    { $$ = [$1]; }
  | first_nodes space first_node
    { $1.push($3); $$ = $1; }
  ;

first_node
  : TK_NUMBER
  | tag_name
  | comment
  | open_tag
  | string
  ;

string
  : TK_SINGLE_QUOTE text TK_SINGLE_QUOTE
    { $$ = '"' + $2 + '"'; }
  | TK_DOUBLE_QUOTE text TK_DOUBLE_QUOTE
    { $$ = $1 + $2 + $3; }
  ;

word
  : TK_WORD
  ;

word_dash
  : word
  | word_dash TK_DASH word
    { $$ = $1 + $2 + $3; }
  ;

tag_name
  : word
  | word TK_COLON word_dash
    { $$ = $1 + $2 + $3; }
  ;

open_tag
  : TK_BROKEN_BRACKET_OPEN tag_name space open_tag_slash TK_BROKEN_BRACKET_CLOSE
    { $$ = $1 + $2 + ($4 ? ' ' + $4 : '') + $5; }
  ;

open_tag_slash
  :
  | TK_SLASH
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
  | TK_SLASH
  | TK_OTHER
  ;
