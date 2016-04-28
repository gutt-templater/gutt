var parser = require('./parser').parser
var fs = require('fs')
var path = require('path')

var testFiles = fs.readdirSync(__dirname + '/test')
var result

testFiles.forEach(function (filename) {
  var result

  if (path.extname(filename) === '.txt') {
    result = parser.parse(fs.readFileSync(__dirname + '/test/' + filename, 'utf8'))
    console.log(result)
  }
})
