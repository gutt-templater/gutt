%lex

%%
[\s\n\t]+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[a-zA-Z]+([a-zA-Z0-9_]+)?\b return 'WORD';
"*"                         return '*';
"/"                         return '/';
"-"                         return '-';
"+"                         return '+';
"^"                         return '^';
"("                         return '(';
")"                         return ')';
"["                         return '[';
"]"                         return ']';
"="                         return '=';
","                         return ',';

/lex

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start document

%%

document
  : expressions
    { console.log($1); return $1; }
  ;

expressions
  : assignment
  | expression
    { $$ = {type: 'expr', value: $1}; }
  ;

assignment
  : variable '=' expression
    { $$ = {type: 'assign', value: $1, expr: $3}; }
  ;

variable
  : variable '[' key ']'
    { $1.keys.push($2); $$ = $1; }
  | WORD
    { $$ = {type: 'var', value: $1, keys: []}; }
  ;

key
  : expression
  ;

function
  : variable '(' params ')'
    { $$ = {type: 'func', value: $1, attrs: $2}; }
  ;

params
  :
  | expression
    { $$ = [$1]; }
  | params ',' expression
    { $1.push($3); $$ = $1; }
  ;

expression
  : expression '+' expression
    { $$ = {type: 'plus', value: [$1, $3]}; }
  | expression '-' expression
    { $$ = {type: 'minus', value: [$1, $3]}; }
  | expression '*' expression
    { $$ = {type: 'milt', value: [$1, $3]}; }
  | expression '/' expression
    { $$ = {type: 'devis', value: [$1, $3]}; }
  | '-' expression %prec UMINUS
    { $$ = {type: 'uminus', value: $2}; }
  | '(' expression ')'
    { $$ = {type: 'brack', value: $2}; }
  | function
  | variable
  | NUMBER
    { $$ = {type: 'num', value: $1}; }
  ;
