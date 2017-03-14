var htmlParser = require('./html-parser')
var lexerParseError = require('../helpers/lexer-parse-error')
var ParseError = require('../helpers/parse-error')
var fs = require('fs')
var throwError = require('../helpers/throw-error')

htmlParser.parser.lexer.parseError = lexerParseError

function validateTemplateStructure (tree) {
  if (!tree.firstChild) {
    throw new ParseError('Empty template', {
      line: 1,
      column: 0
    })
  }

  if (~tree.firstChild.type === 'tag' || tree.firstChild.name !== 'component') {
    throw new ParseError('Template must be described at <component></component>', {
      line: tree.firstChild.line,
      column: tree.firstChild.column
    })
  }

  return tree.firstChild.firstChild
}

function Parser (source, filePath, rootPath) {
  this.source = source
  this.result = source
  this.filePath = filePath || ''
  this.rootPath = rootPath || ''

  if (typeof this.source === 'string') {
    try {
      this.result = htmlParser.parse(this.source)
      this.result = validateTemplateStructure(this.result)
    } catch (e) {
      throwError(e, this.source, this.filePath, this.rootPath)
    }
  }

  return this
}

Parser.prototype.getRootPath = function () {
  return this.rootPath
}

Parser.prototype.filePath = function () {
  return this._filePath
}

Parser.prototype.stringifyWith = function (stringifier) {
  try {
    return stringifier(this.result, this.source, this.filePath, this.rootPath)
  } catch (e) {
    throwError(e, this.source, this.filePath, this.rootPath)
  }

}

module.exports = {
  parse: function (str, filePath, rootPath) {
    return new Parser (str, filePath, rootPath)
  },

  parseFile: function (filePath, rootPath) {
    return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath, rootPath)
  }
}
