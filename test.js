var parser = require('./parser')([
  require('./modules/bem'),
  require('./modules/tag'),
  require('./modules/logic'),
  require('./modules/assignment')
], [
  require('./stringifiers/php')
])
var fs = require('fs')
var path = require('path')

var testHtmlFiles = fs.readdirSync(__dirname + '/test/html')
var testLogicFiles = fs.readdirSync(__dirname + '/test/logic')

testHtmlFiles.forEach(function (filename) {
  var result
  var filebase

  if (path.extname(filename) === '.txt') {
    filebase = path.basename(filename, path.extname(filename))
    result = parser(fs.readFileSync(__dirname + '/test/html/' + filename, 'utf8'))
    fs.writeFileSync(__dirname + '/dist/' + filebase + '.php', result.php)
  }
})

testLogicFiles.forEach(function (filename) {
  var result
  var filebase

  if (path.extname(filename) === '.txt') {
    filebase = path.basename(filename, path.extname(filename))
    result = parser(fs.readFileSync(__dirname + '/test/logic/' + filename, 'utf8'))
    fs.writeFileSync(__dirname + '/dist/' + filebase + '.php', result.php)
  }
})
