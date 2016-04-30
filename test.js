var parser = require('./parser')([
  require('./modules/tag')
], [
  require('./stringifiers/php')
])
var fs = require('fs')
var path = require('path')

var testFiles = fs.readdirSync(__dirname + '/test/html')
var result

testFiles.forEach(function (filename) {
  var result
  var filebase

  if (path.extname(filename) === '.txt') {
    filebase = path.basename(filename, path.extname(filename))
    result = parser(fs.readFileSync(__dirname + '/test/html/' + filename, 'utf8'))
    fs.writeFileSync(__dirname + '/dist/' + filebase + '.php', result.php)
  }
})
