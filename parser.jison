%lex

%%
[\s\n\t]+             return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b  return 'TK_NUMBER';
<<EOF>>               return 'EOF';

/lex

%start document

%%

document
  : TK_NUMBER space EOF
    { console.log('This is the number!', $1); }
  ;

space
  :
  | TK_SPACE
  ;
