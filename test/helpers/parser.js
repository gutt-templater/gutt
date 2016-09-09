var path = require('path')
var parserPath = process.env.MYPROJECT_COV ? './parsers-cov' : './parsers'
var modulesPath = process.env.MYPROJECT_COV ? './modules-cov' : './modules'
var stringifiersPath = process.env.MYPROJECT_COV ? './stringifiers-cov' : './stringifiers'

module.exports = require(path.resolve(parserPath, 'parser'))([
  require(path.resolve(modulesPath, 'import')),
  require(path.resolve(modulesPath, 'tag')),
  require(path.resolve(modulesPath, 'if')),
  require(path.resolve(modulesPath, 'foreach')),
  require(path.resolve(modulesPath, 'logic')),
  require(path.resolve(modulesPath, 'text')),
  require(path.resolve(modulesPath, 'assignment'))
], [
  require(path.resolve(stringifiersPath, 'php')),
  require(path.resolve(stringifiersPath, 'javascript'))
])
