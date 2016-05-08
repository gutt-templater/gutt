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
        currentNexting.flag = currentNexting.flag | N_OPEN
      },
      closeNeste: function (keyword) {
        currentNexting.keyword = keyword
        currentNexting.flag = currentNexting.flag | N_CLOSE
      },
      logicMatch: function (item, rule) {
        var ruleItems = rule.split('.')
        var currItem = item
        var matched = true
        var field
        var expr
        var out

        ruleItems.forEach(function (ruleItem, index) {
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
    }

    raw.forEach(function (item) {
      var checked = false

      if (item.type === 'logic') {
        item.value = logicParser.parse(item.value)
      }

      try {
        item.parent = currentParent
        modules.forEach(function (module) {
          checked = module.check(helper, item)

          if (checked === true) {
            if (currentNexting.flag & N_CLOSE) {
              if (nesteStack[nesteStack.length - 1] === currentNexting.keyword) {
                nesteStack.pop()
              } else {
                throw new SyntaxError('Syntax error: extected ' + nesteStack[nesteStack.length - 1] +
                  ', got ' + keyword)
              }

              if (currentNexting.flag & N_OPEN) {
                currentNode = currentNode.parent
                currentParent = currentNode.parent
                currentNexting.flag = currentNexting.flag & ~N_CLOSE
              }
            }

            currentNode.childs.push(item)

            if (currentNexting.flag & N_OPEN) {
              item.childs = []
              item.parent = currentNode
              currentParent = currentNode
              currentNode = item
              nesteStack.push(currentNexting.keyword)
              currentNexting.flag = currentNexting.flag & ~N_OPEN
            }

            currentNexting.keyword = null

            throw new BreakException()
          }

          if (currentNexting.flag & N_CLOSE) {
            if (module.closeNeste) {
              module.closeNeste(currentNode)
            }

            currentNode = currentNode.parent
            currentParent = currentNode.parent
            currentNexting.flag = currentNexting.flag & ~N_CLOSE
            currentNexting.keyword = null
          }
        })
      } catch (e) {
        if (e.name !== 'BreakException') {
          console.error(e.message)
        }
      }
    })

    if (nesteStack.length) {
      console.error('Syntax error: there is not closed neste elements: ' + nesteStack.join(', '))
    }

    stringifiers.forEach(function (stringifier) {
      results[stringifier.ext] = stringifier.stringify(result)
    })

    return results
  }
}
