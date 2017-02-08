var htmlParser = require('./html-parser')
var lexerParseError = require('./lexer-parse-error')
var ParseError = require('./parse-error')
var fs = require('fs')
var chalk = require('chalk')

htmlParser.parser.lexer.parseError = lexerParseError

function o (character, number) {
  var i;
  var c

  if (!number) {
    number = 1
  }

  c = new Array(number - 1)

  for (i = 0; i < number; i++) {
    c[i] = character
  }

  return c.join('')
}

function throwError (e, source, filePath, rootPath) {
  var lines
  var previousLineNumber
  var currentLineNumber
  var nextLineNumber
  var previousLine = ''
  var currentLine
  var arrowLine
  var nextLine = ''
  var column

  lines = source.split(/\n/g)
  currentLineNumber = e.hash.line
  previousLineNumber = currentLineNumber - 1
  nextLineNumber = currentLineNumber + 1
  column = e.hash.column

  if (previousLineNumber) {
    previousLine = o(' ', 3 - previousLineNumber.toString().length) + previousLineNumber + ' | ' + lines[previousLineNumber - 1] + '\n'
  }

  if (lines[nextLineNumber]) {
    nextLine = '\n' + o(' ', 3 - nextLineNumber.toString().length) + nextLineNumber + ' | ' + lines[nextLineNumber - 1] + '\n'
  }

  currentLine = o(' ', 3 - currentLineNumber.toString().length) + currentLineNumber + ' | ' + lines[currentLineNumber - 1] + '\n'

  arrowLine = o(' ', 3) + ' | ' + o(' ', column) + '^'

  throw new Error(
    chalk.red(e.message + ' ' + (filePath ? 'in ' + filePath + ':' : 'at ') +
    '(' + currentLineNumber + ':' + column + ')\n') +
    previousLine + currentLine + arrowLine + nextLine
  )
}

function validateTemplateStructure (tree) {
  var isModelDefined = false
  var isTemplateDefined = false
  var isAnotherNodeDefined = false
  var currentNode = tree.firstChild.firstChild
  var modelAndTemplateAndImportNodes = ['x-model', 'x-template']

  if (~tree.firstChild.type === 'tag' || tree.firstChild.name !== 'x-component') {
    throw new ParseError('Template must be described at <x-component></x-component>', {
      line: isAnotherNodeDefined.line,
      column: isAnotherNodeDefined.column
    })
  }

  while (currentNode) {
    if (currentNode.type === 'tag' && currentNode.name === 'x-model') {
      isModelDefined = currentNode
      currentNode.parentNode = null
    }

    if (currentNode.type === 'tag' && currentNode.name === 'x-template') {
      isTemplateDefined = currentNode
      currentNode.parentNode = null
    }

    if (currentNode.type === 'logic-node' && !isAnotherNodeDefined) {
      isAnotherNodeDefined = currentNode
    }

    if (currentNode.type === 'tag' && !~modelAndTemplateAndImportNodes.indexOf(currentNode.name) && !isAnotherNodeDefined) {
      isAnotherNodeDefined = currentNode
    }

    if (currentNode.type === 'text' && !isAnotherNodeDefined && currentNode.text.trim().length) {
      isAnotherNodeDefined = currentNode
    }

    currentNode = currentNode.nextSibling
  }

  if ((isModelDefined || isTemplateDefined) && isAnotherNodeDefined) {
    throw new ParseError('Node shouldn\'t be used with <x-model> or <x-template />. Use simple templates or comlicated, don\'t mix them.', {
      line: isAnotherNodeDefined.line,
      column: isAnotherNodeDefined.column
    })
  }

  if (!isTemplateDefined) {
    isTemplateDefined = tree.firstChild
    isTemplateDefined.parentNode = null
  }

  return {
    model: isModelDefined,
    template: isTemplateDefined
  }
}

function Parser (source, filePath, rootPath) {
  this.source = source
  this.filePath = filePath || ''
  this.rootPath = rootPath || ''

  if (typeof this.source === 'string') {
    try {
      this.source = htmlParser.parse(this.source)
      this.source = validateTemplateStructure(this.source)
    } catch (e) {
      throwError(e, source, this.filePath, this.rootPath)
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
  return stringifier(this.source.model, this.source.template)
}

module.exports = {
  parse: function (str, filePath, rootPath) {
    return new Parser (str, filePath, rootPath)
  },

  parseFile: function (filePath, rootPath) {
    return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath, rootPath)
  }
}
