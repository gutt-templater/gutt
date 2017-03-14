%{
var Script = require('../tokens/script');
var Tag = require('../tokens/tag');
var Comment = require('../tokens/comment');
var Text = require('../tokens/text');
var Str = require('../tokens/string');
var Attr = require('../tokens/attr');
var Logic = require('../tokens/logic');
var LogicNode = require('../tokens/logic-node');
var logicParser = require('./logic-parser')
var currentNode;
var ParseError = require('../helpers/parse-error')
var lexerParseError = require('../helpers/lexer-parse-error')

logicParser.parser.lexer.parseError = lexerParseError;

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

  if (!currentNode.firstChild) {
    currentNode.firstChild = node;
  }

  if (currentNode.lastChild) {
    currentNode.lastChild.nextSibling = node;
    node.previousSibling = currentNode.lastChild;
  }

  currentNode.lastChild = node;
}

function createLogicNode (node, line, column) {
  var result;

  try {
    result = logicParser.parse(node)
  } catch (e) {
    e.hash.line += line
    e.hash.column = column + e.hash.loc.last_column

    throw new ParseError('Unexpected token', e.hash);
  }

  return new Logic(result, line, column);
}
%}

%lex

%%
[\s\n\t]+                   /* skip whitespace */
<<EOF>>                     return 'EOF';
[a-zA-Z_][a-zA-Z\-_0-9]*\b  return 'ID';
\<script(.|\s|\n|\t)*?\>(.|\s|\n|\t)*?\<\/\s*script  return 'SCRIPT_LITERAL';
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
  : SCRIPT_LITERAL text_after_tag
    {
      var script = new Script($1, @1.first_line, @1.first_column);

      appendNode(script);

      if ($2) {
        appendNode($2);
      }
    }
  | '<' sl tagname attrs ss text_after_tag
    {
      if (!$2.length) {
        var isSingle = $5.length || $3 === '!DOCTYPE';
        var tag = new Tag($3, $4, isSingle, @1.first_line, @1.first_column);
        appendNode(tag);

        if (!tag.isSingle) {
          currentNode = tag;
        }
      } else {
        if ($3 !== currentNode.name) {
          throw new ParseError('Expected `' + currentNode.name + '` instead of got `' + $3 + '`', {
            text: '',
            token: null,
            line: @3.first_line,
            column: @3.first_column
          });
        }

        currentNode = currentNode.parentNode;
      }

      if ($6) {
        appendNode($6);
      }
    }
  | COMMENT_LITERAL text_after_tag
    {
      var comment = new Comment($1.substr(4, $1.length - 6), @1.first_line, @1.first_column);
      appendNode(comment);

      if ($2) {
        appendNode($2);
      }
    }
  | logic close_logic
    {
      var logic = new LogicNode($1, @1.first_line, @2.first_column);

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
    { $$ = new Attr(new Str($1, @1.first_line, @1.first_column), null); }
  | ID '=' string
    { $$ = new Attr(new Str($1, @1.first_line, @1.first_column), $3); }
  | ID '=' logic LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = new Attr(new Str($1, @1.first_line, @1.first_column), $3); }
  | string
    { $$ = new Attr(null, $1); }
  | logic LOGIC_CLOSE_AT_ATTRIBUTE '=' string
    { $$ = new Attr($1, $4); }
  | logic LOGIC_CLOSE_AT_ATTRIBUTE '=' logic LOGIC_CLOSE_AT_ATTRIBUTE
    { $$ = new Attr($1, $4); }
  ;

logic
  : LOGIC_LITERAL
    { $$ = createLogicNode($1.substr(1), @1.first_line, @1.first_column + 2); }
  ;

string
  : STRING_DOUBLE_QUOTE_LITERAL
    { $$ = new Str(prepareDoubleQuoteString($1), @1.first_line, @1.first_column + 1); }
  | STRING_SINGLE_QUOTE_LITERAL
    { $$ = new Str(prepareSingleQuoteString($1), @1.first_line, @1.first_column + 1); }
  ;

sl
  :
    { $$ = ''; }
  | '/'
  ;

text_after_tag
  : TEXT_AFTER_TAG
    { if ($1.length > 1) {
        $$ = new Text($1.substr(1), @1.first_line, @1.first_column);
      } else {
        $$ = null;
      }
    }
  ;

text_after_logic
  : TEXT_AFTER_LOGIC
    { if ($1.length > 1) {
        $$ = new Text($1.substr(1), @1.first_line, @1.first_column);
      } else {
        $$ = null;
      }
    }
  ;
