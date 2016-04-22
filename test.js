var parser = require('./parser').parser
var fs = require('fs')
var path = require('path')

var testFiles = fs.readdirSync(__dirname + '/test')
testFiles.forEach(function (filename) {
  var result

  if (path.extname(filename) === '.txt') {
    parser.parse(fs.readFileSync(__dirname + '/test/' + filename, 'utf8'))
  }
})
