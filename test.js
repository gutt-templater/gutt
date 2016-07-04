var parser = require('./parser')([
  require('./modules/bem'),
  require('./modules/layout'),
  require('./modules/tag'),
  require('./modules/if'),
  require('./modules/foreach'),
  require('./modules/logic'),
  require('./modules/text'),
  require('./modules/assignment')
], [
  require('./stringifiers/php')
])
var fs = require('fs')
var path = require('path')

var testFiles = fs.readdirSync(__dirname + '/test')

testFiles.forEach(function (filename) {
  var result
  var filebase

  if (path.extname(filename) === '.txt' && path.basename(filename) === 'logic-concat.txt') {
    filebase = path.basename(filename, path.extname(filename))
    result = parser(fs.readFileSync(__dirname + '/test/' + filename, 'utf8'))
    fs.writeFileSync(__dirname + '/dist/' + filebase + '.php', result.php)
  }
})
