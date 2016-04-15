%lex

%%
[\s\n\t]+                   return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b        return 'TK_NUMBER';
[a-zA-Z]+([a-zA-Z0-9]+)?\b  return 'TK_WORD';
[:]                         return 'TK_COLON';
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
  ;

word
  : TK_WORD
  ;

tag_name
  : word
  | word TK_COLON word
    { $$ = $1 + $2 + $3; }
  ;

space
  :
  | TK_SPACE
  ;
