var fs = require('fs')
var htmlParser = require('./parsers/html-parser').parser
var nester = require('./nester')

module.exports = function (_modules, _stringifiers) {
  return {
    parse: function (str, filePath) {
      var modules = _modules.slice(0)
      var stringifiers = _stringifiers.slice(0)
      var raw = htmlParser.parse(str)
      var results = {}
      var result

      try {
        result = nester(raw, modules, filePath)

        stringifiers.forEach(function (stringifier) {
          results[stringifier.ext] = stringifier.stringify(result)
        })

        return results
      } catch (e) {
        console.error(e.message)
      }

      return false
    },

    parseFile: function (filePath) {
      return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath);
    }
  }
}
