var htmlParser = require('./parsers/html-parser').parser
var logicParser = require('./parsers/logic-parser').parser
var fs = require('fs')
var N_NOTHING = 1 << 0
var N_OPEN = 1 << 1
var N_CLOSE = 1 << 2

function BreakException (err) {
  this.name = 'BreakException'
  this.message = err
}

function nester (raw, modules, filePath) {
  var result = {
    childs: [],
    type: 'root'
  }
  var currentNode = result
  var currentParent = result

  var currentNexting = {
    flag: N_NOTHING,
    keyword: null
  }
  var nesteStack = []

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
    },

    parser: {
      parse: function (str, filePath) {
        return nester(htmlParser.parse(str), modules, filePath);
      },

      parseFile: function (filePath) {
        return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath);
      }
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
        checked = module.check(helper, item, modules)

        if (currentNexting.flag & N_CLOSE) {
          if (nesteStack[nesteStack.length - 1] === currentNexting.keyword) {
            nesteStack.pop()
          } else {
            throw new SyntaxError('Syntax error: extected ' + nesteStack[nesteStack.length - 1] +
              ', got ' + currentNexting.keyword)
          }

          modules.forEach(function (module) {
            if (module.closeNeste) {
              module.closeNeste(currentNode)
            }
          })

          currentNode = currentNode.parent
          currentParent = currentNode.parent
          currentNexting.flag = currentNexting.flag & ~N_CLOSE
        }

        if (checked === true) {
          currentNode.childs.push(item)
        }

        if (currentNexting.flag & N_OPEN) {
          item.childs = []
          item.parent = currentNode
          currentParent = currentNode
          currentNode = item
          nesteStack.push(currentNexting.keyword)
          currentNexting.flag = currentNexting.flag & ~N_OPEN
        }

        currentNexting.keyword = null

        if (checked === true) {
          throw new BreakException()
        }
      })
    } catch (e) {
      if (e.name !== 'BreakException') {
        console.error(e.message)
      }
    }
  })

  if (nesteStack.length) {
    throw new SyntaxError('Syntax error: there is not closed neste elements: ' + nesteStack.join(', '))
  }

  return result
}

module.exports = nester
