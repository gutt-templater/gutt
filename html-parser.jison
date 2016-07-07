%{
var singleTags = [];

function prepareDoubleQuoteString(str) {
  return str.substr(1, str.length - 2);
}

function prepareSingleQuoteString(str) {
  return str.substr(1, str.length - 2).replace(/\\\'/g, '\'');
}
%}

%lex

%%
[\s\n\t]+                   /* skip whitespace */
<<EOF>>                     return 'EOF';
[a-zA-Z][a-zA-Z\-0-9]*\b    return 'ID';
\<\!\-\-.*?\-\-\>           return 'COMMENT_LITERAL';
':'                         return ':';
'<'                         return '<';
'/'                         return '/';
'='                         return '=';
\}[^\"\{\<]*?\"             return 'TEXT_TAIL_AFTER_LOGIC_BEFORE_DOUBLE_QUOTE';
\}[^\'\{\<]*?\'             return 'TEXT_TAIL_AFTER_LOGIC_BEFORE_SINGLE_QUOTE';
[>][^<{]*                   return 'TEXT_AFTER_TAG';
[}][^<{]*                   return 'TEXT_AFTER_LOGIC_BEFORE_LOGIC';
\{(\\\}|[^}])*              return 'LOGIC_LITERAL';
\"[^\"\{]*?(?=\{)           return 'STRING_DOUBLE_QUOTE_BEFORE_LOGIC';
\'[^\'\{]*?(?=\{)           return 'STRING_SINGLE_QUOTE_BEFORE_LOGIC';
\"(\\\"|[^\"])*?\"          return 'STRING_DOUBLE_QUOTE_LITERAL';
\'(\\\'|[^\'])*?\'          return 'STRING_SINGLE_QUOTE_LITERAL';
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
    { $$ = [{type: ($2.length ? 'close_tag' : 'open_tag'), value: $3, attrs: $4}]; if ($5.length) $$ = $$.concat($5); }
  | COMMENT_LITERAL
    { $$ = [{type: 'comment', value: $1.substr(4, $1.length - 7)}]; }
  | LOGIC_LITERAL TEXT_AFTER_LOGIC_BEFORE_LOGIC
    { $$ = [{type: 'logic', value: $1.substr(1)}]; }
  ;

ss
  :
    { $$ = ''; }
  | '/'
    { $$ = ''; }
  ;

tagname
  : se ID
    { $$ = $1; }
  | se ID ':' ID
    { $$ = $1 + $2 + $3; }
  ;

se
  :
    { $$ = ''; }
  | '!'
    { $$ = ''; }
  ;

attrs
  :
    { $$ = []; }
  | attrs attr
    { $1.push($2); $$ = $1; }
  ;

attr
  : ID optnl_val
    { $$ = {name: $1, value: $2}; }
  ;

optnl_val
  :
    { $$ = []; }
  | '=' string
    { $$ = $2; }
  ;

string
  : STRING_DOUBLE_QUOTE_LITERAL
    { $$ = [{type: 'text', value: prepareDoubleQuoteString($1)}]; }
  | STRING_SINGLE_QUOTE_LITERAL
    { $$ = [{type: 'text', value: prepareSingleQuoteString($1)}]; }
  | string_elements
  ;

string_elements
  : string_element
    { $$ = [$1]; }
  | string_elements string_element
    { $1.push($2); $$ = $1; }
  ;

string_element
  : STRING_DOUBLE_QUOTE_BEFORE_LOGIC LOGIC_LITERAL logic_other_elements TEXT_TAIL_AFTER_LOGIC_BEFORE_DOUBLE_QUOTE
    { $$ = [{type: 'text', value: $1.substr(1)}, {type: 'logic', value: $2.substr(1).trim()}]; $$ = $$.concat($3); $$.push($4.substr(0, $4.length - 1)); }
  | STRING_SINGLE_QUOTE_BEFORE_LOGIC LOGIC_LITERAL logic_other_elements TEXT_TAIL_AFTER_LOGIC_BEFORE_SINGLE_QUOTE
    { $$ = [{type: 'text', value: $1.substr(1)}, {type: 'logic', value: $2.substr(1).trim()}]; $$ = $$.concat($3); $$.push($4.substr(0, $4.length - 1)); }
  ;

logic_other_elements
  :
    { $$ = []; }
  | logic_other_elements logic_other_element
    { $$ = $1.concat($2); }
  ;

logic_other_element
  : TEXT_AFTER_LOGIC_BEFORE_LOGIC LOGIC_LITERAL
    { $$ = [{type: 'text', value: $1.substr(1)}, {type: 'logic', value: $2.substr(1).trim()}]; }
  ;

sl
  :
    { $$ = ''; }
  | '/'
  ;

text
  : text_element
    { $$ = [$1]; }
  | text text_element
    { if ($2.value.length) $1.push($2); $$ = $1; }
  ;

text_element
  : TEXT_AFTER_TAG
    { $$ = {type: 'text', value: $1.substr(1)}; }
  | TEXT_AFTER_LOGIC_BEFORE_LOGIC
    { $$ = {type: 'text', value: $1.substr(1)}; }
  ;
