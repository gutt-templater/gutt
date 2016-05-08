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
"=="                        return '==';
"!="                        return '!=';
"<="                        return '<=';
">="                        return '>=';
"="                         return '=';
"<"                         return '<';
">"                         return '>';
"&&"                        return '&&';
"||"                        return '||';
"&"                         return '&';
"|"                         return '|';
"!"                         return '!';
","                         return ',';
\'                          return 'SINGLE_QUOTE';
\"                          return 'DOUBLE_QUOTE';

/lex

%left '||' '||'
%left '&&' '&&'
%left '|' '|'
%left '&' '&'
%left '!=' '!='
%left '==' '=='
%left '>=' '>='
%left '>' '>'
%left '<=' '<='
%left '<' '<'
%left '+' '-'
%left '*' '/'
%left UMINUS
%left NOT

%start document

%%

document
  : expressions
    { return $1; }
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
  : variable '[' expression ']'
    { $1.keys.push($3); $$ = $1; }
  | WORD
    { $$ = {type: 'var', value: $1, keys: []}; }
  ;

function
  : variable '(' params ')'
    { $$ = {type: 'func', value: $1, attrs: $3}; }
  ;

params
  :
    { $$ = []; }
  | expression
    { $$ = [$1]; }
  | params ',' expression
    { $1.push($3); $$ = $1; }
  ;

string
  : SINGLE_QUOTE WORD SINGLE_QUOTE
    { $$ = '"' + $2 + '"'; }
  | DOUBLE_QUOTE WORD DOUBLE_QUOTE
    { $$ = '"' + $2 + '"'; }
  ;

expression
  : expression '||' expression
    { $$ = {type: 'or', value: [$1, $3]}; }
  | expression '&&' expression
    { $$ = {type: 'and', value: [$1, $3]}; }
  | expression '|' expression
    { $$ = {type: 'bitor', value: [$1, $3]}; }
  | expression '&' expression
    { $$ = {type: 'bitand', value: [$1, $3]}; }
  | expression '!=' expression
    { $$ = {type: 'notequal', value: [$1, $3]}; }
  | expression '==' expression
    { $$ = {type: 'equal', value: [$1, $3]}; }
  | expression '>=' expression
    { $$ = {type: 'gtequal', value: [$1, $3]}; }
  | expression '>' expression
    { $$ = {type: 'gt', value: [$1, $3]}; }
  | expression '<=' expression
    { $$ = {type: 'ltequal', value: [$1, $3]}; }
  | expression '<' expression
    { $$ = {type: 'lt', value: [$1, $3]}; }
  | expression '+' expression
    { $$ = {type: 'plus', value: [$1, $3]}; }
  | expression '-' expression
    { $$ = {type: 'minus', value: [$1, $3]}; }
  | expression '*' expression
    { $$ = {type: 'mult', value: [$1, $3]}; }
  | expression '/' expression
    { $$ = {type: 'divis', value: [$1, $3]}; }
  | '-' expression %prec UMINUS
    { $$ = {type: 'uminus', value: $2}; }
  | '!' expression %prec NOT
    { $$ = {type: 'not', value: $2}; }
  | '(' expression ')'
    { $$ = {type: 'brack', value: $2}; }
  | function
  | variable
  | string
  | NUMBER
    { $$ = {type: 'num', value: $1}; }
  ;
