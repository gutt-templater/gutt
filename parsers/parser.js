var htmlParser = require('./html-parser').parser
var logicParser = require('./logic-parser').parser
var clone = require('./clone')
var fs = require('fs')

function Parser (source, filePath, modules, stringifiers) {
  var self = this

  this.source = source

  if (typeof this.source === 'string') {
    this.source = htmlParser.parse(this.source)
  }

  this._filePath = filePath
  this._modules = modules
  this._stringifiers = stringifiers

  this._tree = {
    type: 'root',
    childs: []
  }

  this.currentNode = this._tree
  this.currentParent = this._tree

  this.nesteStack = []

  this._checked = false

  this.source.forEach(function (rawItem) {
    var item = clone(rawItem)

    if (item.type === 'logic') {
      item.value = logicParser.parse(item.value)
    }

    item.parent = self.currentNode

    self._checked = false

    self._modules.forEach(function (module) {
      if (self._checked) return

      module.check(self, item)
    })
  })

  if (this.nesteStack.length) {
    throw new SyntaxError('Syntax error: there is not closed neste elements: ' + this.nesteStack.join(', '))
  }
}

Parser.prototype.match = function (item, rule) {
  var ruleItems = rule.split('.')
  var currItem = item
  var matched = true
  var field
  var expr
  var out

  ruleItems.forEach(function (ruleItem) {
    if (!matched) return false

    out = ruleItem.match(/([a-z]+)(\[([a-z]+)\])?/i)
    field = out[1]
    expr = out[3]

    if (typeof currItem === 'string') {
      if (expr || currItem !== field) {
        matched = false
      }
    } else if (expr) {
      if (currItem[field] && currItem[field] === expr) {
        currItem = currItem.value
      } else {
        matched = false
      }
    } else if (currItem[field]) {
      currItem = currItem.value
    } else {
      matched = false
    }
  })

  return matched
}

Parser.prototype.push = function (item) {
  this.currentNode.childs.push(item)

  this._checked = true
}

Parser.prototype.open = function (item, keyword) {
  item.childs = []
  item.parent = this.currentNode

  this.currentNode.childs.push(item)

  this.currentParent = this.currentNode
  this.currentNode = item
  this.nesteStack.push(keyword)

  this._checked = true
}

Parser.prototype.close = function (keyword) {
  if (this.nesteStack[this.nesteStack.length - 1] === keyword) {
    this.nesteStack.pop()
  } else {
    throw new SyntaxError('Syntax error: extected ' + this.nesteStack[this.nesteStack.length - 1] +
      ', got ' + keyword)
  }

  this.currentNode = this.currentNode.parent
  this.currentParent = this.currentNode.parent

  this._checked = true
}

Parser.prototype.skip = function () {
  this._checked = true
}

Parser.prototype.filePath = function () {
  return this._filePath
}

Parser.prototype.replace = function (node, tree) {
  var i
  var len
  var nodeIndex
  var parent = node.parent

  for (i = 0, len = parent.childs.length; i < len; i += 1) {
    if (parent.childs[i] === node) {
      nodeIndex = i
    }
  }

  if (typeof nodeIndex !== 'undefined') {
    parent.childs.splice(nodeIndex, 1)

    for (i = nodeIndex + tree.length; i > nodeIndex; i -= 1) {
      parent.childs.splice(nodeIndex, 0, tree[i - nodeIndex - 1])
    }
  }

  for (i = 0, len = tree.length; i < len; i += 1) {
    tree[i].parent = node.parent
  }
}

Parser.prototype.tree = function () {
  return this._tree
}

Parser.prototype.modules = function () {
  return this._modules
}

Parser.prototype.strings = function () {
  var self = this
  var results = {}

  this._stringifiers.forEach(function (stringifier) {
    results[stringifier.ext] = stringifier.stringify(clone(self._tree)).trim()
  })

  return results
}

module.exports = function (modules, stringifiers) {
  return {
    parse: function (str, filePath) {
      return new Parser (str, filePath, modules, stringifiers)
    },

    parseFile: function (filePath) {
      return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath, modules, stringifiers)
    }
  }
}
