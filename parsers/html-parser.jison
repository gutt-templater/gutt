%{
function prepareDoubleQuoteString(str) {
  return str.substr(1, str.length - 2);
}

function prepareSingleQuoteString(str) {
  return str.substr(1, str.length - 2).replace(/\\\'/g, '\'');
}

function prepareText(arr, text) {
  if (text.length) {
    arr.push({type: 'text', value: text});
  }
}

function prepareLogic(arr, text) {
  arr.push({type: 'logic', value: text.trim()});
}
%}

%lex

%%
[\s\n\t]+                   /* skip whitespace */
<<EOF>>                     return 'EOF';
[a-zA-Z_][a-zA-Z\-_0-9]*\b  return 'ID';
\<\!\-\-.*?\-\-\>           return 'COMMENT_LITERAL';
':'                         return ':';
'<'                         return '<';
'/'                         return '/';
'='                         return '=';
\}(?=(\{(\\\}|[^\}])*?\}|\"(\\\"|[^\"])*?\"|[^\"\'\{\}\<\>])*\>)       return 'LOGIC_CLOSE_AT_ATTRIBUTE';
\}[^\"\{\<]*?\"             return 'TEXT_TAIL_AFTER_LOGIC_BEFORE_DOUBLE_QUOTE';
\}[^\'\{\<]*?\'             return 'TEXT_TAIL_AFTER_LOGIC_BEFORE_SINGLE_QUOTE';
\>[^<\{]*                   return 'TEXT_AFTER_TAG';
\}[^><\{]*(?=(\{|\<))       return 'TEXT_AFTER_LOGIC';
\{(\\\}|[^}])*              return 'LOGIC_LITERAL';
\"[^\"\{]*?(?=\{)           return 'STRING_DOUBLE_QUOTE_BEFORE_LOGIC';
\'[^\'\{]*?(?=\{)           return 'STRING_SINGLE_QUOTE_BEFORE_LOGIC';
\"(\\\"|[^\"])*?\"          return 'STRING_DOUBLE_QUOTE_LITERAL';
\'(\\\'|[^\'])*?\'          return 'STRING_SINGLE_QUOTE_LITERAL';
'}'                         return '}';
'!'                         return '!';
'/'                         return '/';

/lex

%start document

%%

document
  : nodes EOF
    { return $1; }
  ;

nodes
  :
    { $$ = []; }
  | nodes node
    { $$ = $1.concat($2); }
  ;

node
  : '<' sl tagname attrs ss text
    { $$ = [{type: ($2.length ? 'close_tag' : ($5.length ? 'single_tag' : 'open_tag')), value: $3, attrs: $4}]; $$ = $$.concat($6); }
  | COMMENT_LITERAL
    { $$ = [{type: 'comment', value: $1.substr(4, $1.length - 7)}]; }
  | LOGIC_LITERAL close_logic
    {
      $$ = [];
      prepareLogic($$, $1.substr(1));
      prepareText($$, $2.substr(1));
    }
  ;

close_logic
  : TEXT_AFTER_LOGIC
  | '}'
  ;

ss
  :
    { $$ = ''; }
  | '/'
    { $$ = '/'; }
  ;

tagname
  : se ID
    { $$ = $1 + $2; }
  | se ID ':' ID
    { $$ = $1 + $2 + $3 + $4; }
  ;

se
  :
    { $$ = ''; }
  | '!'
  ;

attrs
  :
    { $$ = []; }
  | attrs attr
    { $1.push($2); $$ = $1; }
  ;

attr
  : ID
    { $$ = {type: 'param', name: $1, value: []}; }
  | ID '=' string
    { $$ = {type: 'param', name: $1, value: $3}; }
  | ID '=' LOGIC_LITERAL LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = {type: 'param', name: $1, value: {type: 'logic', value: $3.substr(1).trim()}}; }
  | string
    { $$ = {type: 'param', string: $1}; }
  | LOGIC_LITERAL LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = {type: 'logic', value: $1.substr(1).trim()}; }
  ;

string
  : STRING_DOUBLE_QUOTE_LITERAL
    { $$ = []; prepareText($$, prepareDoubleQuoteString($1)); }
  | STRING_SINGLE_QUOTE_LITERAL
    { $$ = []; prepareText($$, prepareSingleQuoteString($1)); }
  | string_element
  ;

string_element
  : STRING_DOUBLE_QUOTE_BEFORE_LOGIC LOGIC_LITERAL logic_other_elements TEXT_TAIL_AFTER_LOGIC_BEFORE_DOUBLE_QUOTE
    {
      $$ = [];
      prepareText($$, $1.substr(1));
      prepareLogic($$, $2.substr(1));
      $$ = $$.concat($3);
      prepareText($$, $4.substr(1, $4.length - 2));
    }
  | STRING_SINGLE_QUOTE_BEFORE_LOGIC LOGIC_LITERAL logic_other_elements TEXT_TAIL_AFTER_LOGIC_BEFORE_SINGLE_QUOTE
    {
      $$ = [];
      prepareText($$, $1.substr(1));
      prepareLogic($$, $2.substr(1));
      $$ = $$.concat($3);
      prepareText($$, $4.substr(1, $4.length - 2));
    }
  ;

logic_other_elements
  :
    { $$ = []; }
  | logic_other_elements logic_other_element
    { $$ = $1.concat($2); }
  ;

logic_other_element
  : TEXT_AFTER_LOGIC LOGIC_LITERAL
    {
      $$ = [];
      prepareText($$, $1.substr(1));
      prepareLogic($$, $2.substr(1));
    }
  ;

sl
  :
    { $$ = ''; }
  | '/'
  ;

text
  : text_element
    { $$ = []; prepareText($$, $1); }
  | text text_element
    { $$ = $1; prepareText($1, $2); }
  ;

text_element
  : TEXT_AFTER_TAG
    { $$ = $1.substr(1); }
  | TEXT_AFTER_LOGIC
    { $$ = $1.substr(1); }
  ;
