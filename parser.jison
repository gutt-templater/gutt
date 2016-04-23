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
\\                          return 'TK_ESCAPE';
\/                          return 'TK_SLASH';
[^\<\>\-\:\/a-zA-Z0-9\{\}\'\"\\]+ return 'TK_OTHER';
<<EOF>>                     return 'EOF';

/lex

%start document

%%

document
  : EOF
  | first_nodes space EOF
    { console.log('This is the first nodes!', $1); }
  ;

first_nodes
  : first_node
    { $$ = [$1]; }
  | first_nodes space first_node
    { $1.push($3); $$ = $1; }
  ;

first_node
  : text
  | comment
  | logic
  | open_tag
  | close_tag
  ;

string
  : TK_SINGLE_QUOTE text_words TK_SINGLE_QUOTE
    { $$ = '"' + $2 + '"'; }
  | TK_DOUBLE_QUOTE text_words TK_DOUBLE_QUOTE
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

close_tag
  : TK_BROKEN_BRACKET_OPEN TK_SLASH tag_name TK_BROKEN_BRACKET_CLOSE
    { $$ = $1 + $2 + $3 + $4; }
  ;

comment
  : TK_COMMENT_OPEN text TK_COMMENT_CLOSE
    { $$ = $1 + $2 + $3; }
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
    { $$ = $2; }
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
  | TK_ESCAPE
  | TK_OTHER
  ;
