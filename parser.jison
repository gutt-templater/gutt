%lex

%%
[\s\n\t]+                   return 'TK_SPACE';
[0-9]+("."[0-9]+)?\b        return 'TK_NUMBER';
[a-zA-Z]+([a-zA-Z0-9]+)?\b  return 'TK_WORD';
\:                          return 'TK_COLON';
\<\!\-\-                    return 'TK_COMMENT_OPEN';
\-\-\>                      return 'TK_COMMENT_CLOSE';
\-                          return 'TK_DASH';
\<                          return 'TK_BROKEN_BRACKET_OPEN';
\>                          return 'TK_BROKEN_BRACKET_CLOSE';
\\\"                        return 'TK_ESCAPE_DOUBLE_QUOTE';
\\\'                        return 'TK_ESCAPE_SINGLE_QUOTE';
\'                          return 'TK_SINGLE_QUOTE';
\"                          return 'TK_DOUBLE_QUOTE';
\\\{                        return 'TK_ESCAPE_LOGIC_BRACKET_OPEN';
\\\}                        return 'TK_ESCAPE_LOGIC_BRACKET_CLOSE';
\{                          return 'TK_LOGIC_BRACKET_OPEN';
\}                          return 'TK_LOGIC_BRACKET_CLOSE';
\=                          return 'TK_EQUAL';
\\                          return 'TK_ESCAPE';
\/                          return 'TK_SLASH';
[^\<\>\-\:\/a-zA-Z0-9\{\}\'\"\\\=]+ return 'TK_OTHER';
<<EOF>>                     return 'EOF';

/lex

%start document

%%

document
  : EOF
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

first_node
  : text_element
    { $$ = {type: 'text', value: $1}; }
  | comment
  | logic
  | open_tag
  | close_tag
  ;

string
  : TK_SINGLE_QUOTE text_words TK_SINGLE_QUOTE
    { $$ = $2; }
  | TK_DOUBLE_QUOTE text_words TK_DOUBLE_QUOTE
    { $$ = $2; }
  ;

word_dash
  : TK_WORD space
  | word_dash TK_DASH TK_WORD space
    { $$ = $1 + $2 + $3; }
  ;

tag_name
  : TK_WORD space
  | TK_WORD TK_COLON word_dash
    { $$ = $1 + $2 + $3; }
  ;

open_tag
  : TK_BROKEN_BRACKET_OPEN tag_name open_tag_slash TK_BROKEN_BRACKET_CLOSE
    { $$ = {type: (!!$3 ? 'single_tag' : 'open_tag'), value: $2}; }
  | TK_BROKEN_BRACKET_OPEN tag_name attributes open_tag_slash TK_BROKEN_BRACKET_CLOSE
    { $$ = {type: (!!$4 ? 'single_tag' : 'open_tag'), value: $2, attrs: $3}; }
  | TK_BROKEN_BRACKET_OPEN tag_name attributes TK_SPACE open_tag_slash TK_BROKEN_BRACKET_CLOSE
    { $$ = {type: (!!$5 ? 'single_tag' : 'open_tag'), value: $2, attrs: $3}; }
  ;

attributes
  : attributes TK_SPACE attribute
    { $1.push($3); $$ = $1; }
  | attribute
    { $$ = [$1]; }
  ;

attribute
  : TK_WORD
    { $$ = {name: $1}; }
  | TK_WORD TK_EQUAL string
    { $$ = {name: $1, value: $2}; }
  | string
    { $$ = {str: $1}; }
  ;

open_tag_slash
  :
  | TK_SLASH
  ;

close_tag
  : TK_BROKEN_BRACKET_OPEN TK_SLASH tag_name TK_BROKEN_BRACKET_CLOSE
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
  : TK_LOGIC_BRACKET_OPEN text TK_LOGIC_BRACKET_CLOSE
    { $$ = {type: 'logic', value: $2.trim()}; }
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
  | TK_COLON
  | TK_DASH
  | escape_logic_open
  | escape_logic_close
  | escape_double_quote
  | escape_single_quote
  | TK_SLASH
  | TK_EQUAL
  | TK_ESCAPE
  | TK_OTHER
  ;
