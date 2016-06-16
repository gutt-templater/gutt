%lex

%%
[\s\n\t]+                   return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b        return 'TK_NUMBER';
[a-zA-Z]+([a-zA-Z0-9]+)?\b  return 'TK_WORD';
([a-zA-Z0-9_]+)\b           return 'TK_WORD_WITH_UNDER';
":"                         return ':';
\<\!\-\-                    return 'TK_COMMENT_OPEN';
\-\-\>                      return 'TK_COMMENT_CLOSE';
"-"                         return '-';
"<"                         return '<';
">"                         return '>';
\\\"                        return 'TK_ESCAPE_DOUBLE_QUOTE';
\\\'                        return 'TK_ESCAPE_SINGLE_QUOTE';
\'                          return 'TK_SINGLE_QUOTE';
\"                          return 'TK_DOUBLE_QUOTE';
\\\{                        return 'TK_ESCAPE_LOGIC_BRACKET_OPEN';
\\\}                        return 'TK_ESCAPE_LOGIC_BRACKET_CLOSE';
"{"                         return '{';
"}"                         return '}';
"="                         return '=';
\\                          return 'TK_ESCAPE';
"/"                         return '/';
"!"                         return '!';
"_"                         return '_';
[^\<\>\-\:\/a-zA-Z0-9\{\}\'\"\\\=\!_]+ return 'TK_OTHER';
<<EOF>>                     return 'EOF';

/lex

%left '{' '}'
%left text_words
%left TK_SPACE
%left TK_NUMBER
%left TK_WORD
%left '-'
%left TK_SINGLE_QUOTE
%left TK_DOUBLE_QUOTE
%left TK_ESCAPE_SINGLE_QUOTE
%left TK_ESCAPE_DOUBLE_QUOTE
%left TK_ESCAPE_LOGIC_BRACKET_CLOSE
%left TK_ESCAPE_LOGIC_BRACKET_OPEN
%left '/'
%left '='
%left '>' '<'
%left TK_ESCAPE
%left '!'
%left '_'
%left '-'
%left ':'
%left TK_WORD_WITH_UNDER
%left TK_OTHER

%start document

%%

document
  : EOF
    { return []; }
  | first_nodes EOF
    { return $1; }
  ;

first_nodes
  : first_node
    { $$ = [$1]; }
  | first_nodes first_node
    {
      if ($2.type === 'text' && $1[$1.length - 1].type === 'text') {
        $1[$1.length - 1].value += $2.value;
      } else {
        $1.push($2);
      }

      $$ = $1;
    }
  ;

mb_space
  :
  | TK_SPACE
  ;

first_node
  : text_element
    { $$ = {type: 'text', value: $1}; }
  | comment
  | logic
  | open_tag
  | close_tag
  ;

word_dash
  : TK_WORD
  | word_dash '-' TK_WORD
    { $$ = $1 + $2 + $3; }
  ;

tag_name
  : word_dash mb_space
  | word_dash ':' word_dash mb_space
    { $$ = $1 + $2 + $3; }
  ;

open_tag
  : '<' expl_mark tag_name attributes open_tag_slash '>'
    { $$ = {type: (!!$5 ? 'single_tag' : 'open_tag'), value: $2 + $3, attrs: $4}; }
  ;

expl_mark
  :
    { $$ = ''; }
  | '!'
  ;

attributes
  :
    { $$ = []; }
  | attributes attribute
    { $1.push($2); $$ = $1; }
  ;

attribute
  : TK_WORD mb_space
    { $$ = {name: $1, value: []}; }
  | TK_WORD '=' string mb_space
    { $$ = {name: $1, value: $3}; }
  | string mb_space
    { $$ = {value: $1}; }
  ;

string
  : TK_SINGLE_QUOTE string_elements TK_SINGLE_QUOTE
    { $$ = $2; }
  | TK_DOUBLE_QUOTE string_elements TK_DOUBLE_QUOTE
    { $$ = $2; }
  ;

string_elements
  : string_element
    { $$ = [$1]; }
  | string_elements string_element
    { $1.push($2); $$ = $1; }
  ;

string_element
  : text_words
    { $$ = {type: 'text', value: $1}; }
  | logic
  ;

open_tag_slash
  :
  | '/'
  ;

close_tag
  : '<' '/' tag_name '>'
    { $$ = {type: 'close_tag', value: $3}; }
  ;

comment
  : TK_COMMENT_OPEN text TK_COMMENT_CLOSE
    { $$ = {type: 'comment', value: $2.trim()}; }
  ;

escape_logic_open
  : TK_ESCAPE_LOGIC_BRACKET_OPEN
    { $$ = '{'; }
  ;

escape_logic_close
  : TK_ESCAPE_LOGIC_BRACKET_CLOSE
    { $$ = '}'; }
  ;

escape_double_quote
  : TK_ESCAPE_DOUBLE_QUOTE
    { $$ = '"'; }
  ;

escape_single_quote
  : TK_ESCAPE_SINGLE_QUOTE
    { $$ = '\''; }
  ;

logic
  : '{' logic_elements '}'
    { $$ = {type: 'logic', value: $2.trim()}; }
  ;

logic_elements
  : logic_element
  | logic_elements logic_element
    { $$ = $1 + $2; }
  ;

logic_element
  : '<'
  | '>'
  | text_element
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
  : text_char
  | TK_SINGLE_QUOTE
  | TK_DOUBLE_QUOTE
  ;

text_words
  : text_char
  | text_words text_char
    { $$ = $1 + $2; }
  ;

text_char
  : TK_SPACE
  | TK_NUMBER
  | TK_WORD
  | TK_WORD_WITH_UNDER
  | ':'
  | '-'
  | escape_logic_open
  | escape_logic_close
  | escape_double_quote
  | escape_single_quote
  | '/'
  | '='
  | TK_ESCAPE
  | '!'
  | TK_OTHER
  ;
