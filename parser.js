var htmlParser = require('./html-parser').parser
var path = require('path')

module.exports = function (_modules, _stringifiers) {
  return function (str) {
    var modules = _modules.slice(0)
    var stringifiers = _stringifiers.slice(0)
    var raw = htmlParser.parse(str)
    var result = {
      childs: []
    }
    var currentNode = result
    var results = {}

    var helper = {
      neste: function (item) {
        item.childs = []
        item.parent = currentNode
        currentNode.childs.push(item)
        currentNode = item
      },
      closeNeste: function (item) {
        currentNode = currentNode.parent
      },
      push: function (item) {
        currentNode.childs.push(item)
      }
    }

    raw.forEach(function (item) {
      modules.forEach(function (module) {
        if (module.check(helper, item)) return false
      })
    })

    stringifiers.forEach(function (stringifier) {
      results[stringifier.ext] = stringifier.stringify(result)
    })

    return results
  }
}
