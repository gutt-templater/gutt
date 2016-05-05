var htmlParser = require('./html-parser').parser
var logicParser = require('./logic-parser').parser
var path = require('path')

function BreakException(err) {
  this.name = 'BreakException'
  this.message = err
}

module.exports = function (_modules, _stringifiers) {
  return function (str) {
    var modules = _modules.slice(0)
    var stringifiers = _stringifiers.slice(0)
    var raw = htmlParser.parse(str)
    var result = {
      childs: []
    }
    var currentNode = result
    var currentParent = result
    var results = {}
    var nesteStack = []
    var isNested = false

    var helper = {
      neste: function (keyword) {
        isNested = keyword
      },
      closeNeste: function (keyword) {
        if (nesteStack[nesteStack.length - 1] === keyword) {
          nesteStack.pop()
          currentNode = currentNode.parent
          currentParent = currentNode.parent
        } else {
          throw new SyntaxError('Syntax error: extected ' + nesteStack[nesteStack.length - 1] +
            ', got ' + keyword)
        }
      }
    }

    raw.forEach(function (item) {
      if (item.type === 'logic') {
        item.value = logicParser.parse(item.value)
      }

      try {
        item.parent = currentParent
        modules.forEach(function (module) {
          if (module.check(helper, item) === true) {
            currentNode.childs.push(item)

            if (isNested) {
              item.childs = []
              item.parent = currentNode
              currentParent = currentNode
              currentNode = item
              nesteStack.push(isNested)
              isNested = false
            }

            throw new BreakException()
          }
        })
      } catch (e) {
        if (e.name !== 'BreakException') {
          console.error(e.message)
        }
      }
    })

    stringifiers.forEach(function (stringifier) {
      results[stringifier.ext] = stringifier.stringify(result)
    })

    return results
  }
}
