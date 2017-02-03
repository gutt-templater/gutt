%{
var Tag = require('./tag');
var Comment = require('./comment');
var Text = require('./text');
var Str = require('./string');
var Attr = require('./attr');
var Logic = require('./logic');
var LogicNode = require('./logic-node');
var logicParser = require('./logic-parser').parser
var currentNode;

function prepareDoubleQuoteString(str) {
  return str.substr(1, str.length - 2);
}

function prepareSingleQuoteString(str) {
  return str.substr(1, str.length - 2).replace(/\\\'/g, '\'');
}

function prepareLogic(arr, text) {
  arr.push({type: 'logic', value: text.trim()});
}

function appendNode(node) {
  node.parentNode = currentNode;

  if (!currentNode.firstNode) {
    currentNode.firstNode = node;
  }

  if (currentNode.lastNode) {
    currentNode.lastNode.nextNode = node;
    node.prevNode = currentNode.lastNode;
  }

  currentNode.lastNode = node;
}
%}

%lex

%%
[\s\n\t]+                   /* skip whitespace */
<<EOF>>                     return 'EOF';
[a-zA-Z_][a-zA-Z\-_0-9]*\b  return 'ID';
\<\!\-\-.*?\-\-             return 'COMMENT_LITERAL';
':'                         return ':';
'<'                         return '<';
'/'                         return '/';
'='                         return '=';
\}(?=(\{(\\\}|[^\}])*?\}|\"(\\\"|[^\"])*?\"|[^\"\'\{\}\<\>])*\>)  return 'LOGIC_CLOSE_AT_ATTRIBUTE';
\>(\\\{|[^\<\{])*           return 'TEXT_AFTER_TAG';
\}[^\>\<\{]*(?=(\{|\<))     return 'TEXT_AFTER_LOGIC';
\{(\\\}|[^}])*              return 'LOGIC_LITERAL';
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
    { $$ = new Tag('root', [], null); currentNode = $$; }
  | nodes node
    { $$ = $1; }
  ;

node
  : '<' sl tagname attrs ss text_after_tag
    {
      if (!$2.length) {
        var tag = new Tag($3, $4, $5.length);
        appendNode(tag);

        if (!tag.isSingle) {
          currentNode = tag;
        }

        if ($6) {
          appendNode($6);
        }
      } else {
        if ($3 !== currentNode.name) {
          throw new SyntaxError('Syntax error: extected `' + currentNode.name + '` instead of got `' + $3 + '`');
        }

        currentNode = currentNode.parentNode;
      }
    }
  | COMMENT_LITERAL text_after_tag
    {
      var comment = new Comment($1.substr(4, $1.length - 6));
      appendNode(comment);

      if ($2) {
        appendNode($2);
      }
    }
  | logic close_logic
    {
      var logic = new LogicNode($1);

      appendNode(logic);

      if ($2) {
        appendNode($2);
      }
    }
  ;

close_logic
  : text_after_logic
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
    { $$ = new Attr(new Str($1), null); }
  | ID '=' string
    { $$ = new Attr(new Str($1), new Str($3)); }
  | ID '=' logic LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = new Attr(new Str($1), $3); }
  | string
    { $$ = new Attr(null, new Str($1)); }
  | logic LOGIC_CLOSE_AT_ATTRIBUTE '=' string
    { $$ = new Attr($1, new Str($4)); }
  | logic LOGIC_CLOSE_AT_ATTRIBUTE '=' logic LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = new Attr($1, $4); }
  ;

logic
  : LOGIC_LITERAL
    { $$ = new Logic(logicParser.parse($1.substr(1))); }
  ;

string
  : STRING_DOUBLE_QUOTE_LITERAL
    { $$ = prepareDoubleQuoteString($1); }
  | STRING_SINGLE_QUOTE_LITERAL
    { $$ = prepareSingleQuoteString($1); }
  ;

sl
  :
    { $$ = ''; }
  | '/'
  ;

text_after_tag
  : TEXT_AFTER_TAG
    { if ($1.length > 1) {
        $$ = new Text($1.substr(1));
      } else {
        $$ = null;
      }
    }
  ;

text_after_logic
  : TEXT_AFTER_LOGIC
    { if ($1.length > 1) {
        $$ = new Text($1.substr(1));
      } else {
        $$ = null;
      }
    }
  ;
