var htmlParser = require('./html-parser').parser
var logicParser = require('./logic-parser').parser
var path = require('path')

function BreakException(err) {
  this.name = 'BreakException'
  this.message = err
}

var N_NOTHING = 1 << 0
var N_OPEN = 1 << 1
var N_CLOSE = 1 << 2

module.exports = function (_modules, _stringifiers) {
  return function (str) {
    var modules = _modules.slice(0)
    var stringifiers = _stringifiers.slice(0)
    var raw = htmlParser.parse(str)
    var result = {
      childs: [],
      type: 'root'
    }
    var currentNode = result
    var currentParent = result
    var results = {}
    var nesteStack = []
    var currentNexting = {
      flag: N_NOTHING,
      keyword: null
    }

    var helper = {
      neste: function (keyword) {
        currentNexting.keyword = keyword
        currentNexting.flag = N_OPEN
      },
      closeNeste: function (keyword) {
        currentNexting.flag = N_CLOSE
        currentNexting.keyword = keyword
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

            if (currentNexting.flag & N_OPEN) {
              item.childs = []
              item.parent = currentNode
              currentParent = currentNode
              currentNode = item
              nesteStack.push(currentNexting.keyword)
              currentNexting.flag = N_NOTHING
              currentNexting.keyword = null
            } else if (currentNexting.flag & N_CLOSE) {
              if (nesteStack[nesteStack.length - 1] === currentNexting.keyword) {
                nesteStack.pop()
              } else {
                throw new SyntaxError('Syntax error: extected ' + nesteStack[nesteStack.length - 1] +
                  ', got ' + keyword)
              }
            }

            throw new BreakException()
          }

          if (currentNexting.flag & N_CLOSE) {
            if (module.closeNeste) {
              module.closeNeste(currentNode)
            }

            currentNode = currentNode.parent
            currentParent = currentNode.parent
            currentNexting.flag = N_NOTHING
            currentNexting.keyword = null
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
