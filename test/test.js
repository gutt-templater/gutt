/* globals describe, it */

var parser = require('../parser')([
  require('../modules/tag'),
  require('../modules/if'),
  require('../modules/foreach'),
  require('../modules/logic'),
  require('../modules/text'),
  require('../modules/assignment')
], [
  require('../stringifiers/php')
])
var chai = require('chai')
var fs = require('fs')
var testFilesDirPath = __dirname + '/fixtures'

chai.should()

function getTestFile (filename) {
  return fs.readFileSync(testFilesDirPath + '/' + filename, 'utf-8').trim()
}

describe('PHP stringifier', function () {
  it ('empty string', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/empty.txt')

    resultFile.php.should.be.equal(getTestFile('empty.expected.php'))
  })

  it ('html empty comment', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/comment-empty.txt')

    resultFile.php.should.be.equal(getTestFile('comment-empty.expected.php'))
  })

  it ('html text comment', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/comment.txt')

    resultFile.php.should.be.equal(getTestFile('comment.expected.php'))
  })

  it ('echo expression', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/expr.txt')

    resultFile.php.should.be.equal(getTestFile('expr.expected.php'))
  })

  it ('foreach expression', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/foreach.txt')

    resultFile.php.should.be.equal(getTestFile('foreach.expected.php'))
  })

  it ('if expression', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/if.txt')

    resultFile.php.should.be.equal(getTestFile('if.expected.php'))
  })

  it ('doctype', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/doctype.txt')

    resultFile.php.should.be.equal(getTestFile('doctype.expected.php'))
  })

  it ('isset', function () {
    var resultFile = parser.parseFile(testFilesDirPath + '/isset.txt')

    resultFile.php.should.be.equal(getTestFile('isset.expected.php'))
  })
})
