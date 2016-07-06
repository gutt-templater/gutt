%lex

%%
[\s\n\t]+                   /* skip whitespace */
<<EOF>>                     return 'EOF';
[a-zA-Z][a-zA-Z\-]*         return 'ID';
\<\!--.*?--\>               return 'LTRLCOMMENT';
'<'                         return '<';
'/'                         return '/';
'='                         return '=';
\}[^\"\{]*?\"               return 'LTRLSTRDBLOGICCLOSE';
\}[^\'\{]*?\'               return 'LTRLSTRSBLOGICCLOSE';
[>}][^<{]*                  return 'LTRLTX';
[{][^}]*                    return 'LTRLLGC';
\"[^\"\{]*?(?=\{)           return 'LTRLSTRDBLOGICOPEN';
\'[^\'\{]*?(?=\{)           return 'LTRLSTRSBLOGICOPEN';
\"[^\"]*?\"                 return 'LTRLSTRDB';
\'[^\']*?\'                 return 'LTRLSTRSG';

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
  : '<' sl ID attrs text
    { $$ = [{type: ($2.length ? 'close_tag' : 'open_tag'), value: $3, attrs: $4}]; if ($5.length) $$ = $$.concat($5); }
  | LTRLCOMMENT
    { $$ = [{type: 'comment', value: $1.substr(4, $1.length - 7)}]; }
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
  : LTRLSTRDB
    { $$ = [{type: 'text', value: $1.substr(1, $1.length - 2)}]; }
  | LTRLSTRSG
    { $$ = [{type: 'text', value: $1.substr(1, $1.length - 2)}]; }
  | string_elements
  ;

string_elements
  : string_element
    { $$ = [$1]; }
  | string_elements string_element
    { $1.push($2); $$ = $1; }
  ;

string_element
  : LTRLSTRDBLOGICOPEN LTRLLGC logic_other_elements LTRLSTRDBLOGICCLOSE
    { $$ = [{type: 'text', value: $1.substr(1)}, {type: 'logic', value: $2.substr(1).trim()}]; $$ = $$.concat($3); $$.push($4.substr(0, $4.length - 1)); }
  | LTRLSTRSBLOGICOPEN LTRLLGC logic_other_elements LTRLSTRSBLOGICCLOSE
    { $$ = [{type: 'text', value: $1.substr(1)}, {type: 'logic', value: $2.substr(1).trim()}]; $$ = $$.concat($3); $$.push($4.substr(0, $4.length - 1)); }
  ;

logic_other_elements
  :
    { $$ = []; }
  | logic_other_elements logic_other_element
    { $$ = $1.concat($2); }
  ;

logic_other_element
  : LTRLTX LTRLLGC
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
  : LTRLTX
    { $$ = {type: 'text', value: $1.substr(1)}; }
  | LTRLLGC
    { $$ = {type: 'logic', value: $1.substr(1).trim()}; }
  ;
