var htmlParser = require('./html-parser').parser
var nester = require('./nester')
var path = require('path')

module.exports = function (_modules, _stringifiers) {
  return function (str) {
    var modules = _modules.slice(0)
    var stringifiers = _stringifiers.slice(0)
    var raw = htmlParser.parse(str)
    var results = {}

    try {
      var result = nester(raw, modules)

      stringifiers.forEach(function (stringifier) {
        results[stringifier.ext] = stringifier.stringify(result)
      })

      return results
    } catch (e) {
      console.error(e.toString())
    }

    return false
  }
}
