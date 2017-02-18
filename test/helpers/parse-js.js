/* global Promise */

var path = require('path')
var fs = require('fs')
var parser = require('../../parsers/parser')
var jsStringifier = require('../../js-stringifier/js-stringifier')
var writeFile = require('./write-file')
var generateName = require('./generate-name')

var tmpFilesDirPath = path.resolve(__dirname, '../../tmp')

function runJsTemplate (templatePath, params) {
  if (!params) {
    params = {}
  }

  return new Promise(function (resolve) {
    var template = require(path.resolve(tmpFilesDirPath, templatePath))

    resolve(template(params))
  })
}

function parseJsAndWriteFile (test, tmpFileName) {
  var resultFile

  try {
    fs.accessSync(tmpFilesDirPath, fs.F_OK)
  } catch (e) {
    fs.mkdir(tmpFilesDirPath)
  }

  resultFile = parser.parse(test).stringifyWith(jsStringifier)

  return writeFile(path.resolve(tmpFilesDirPath, tmpFileName), resultFile)
}

function parseJs (test, data) {
  var tmpFileName = generateName() + '.js'

  if (!data) {
    data = {}
  }

  return parseJsAndWriteFile(test, tmpFileName)
    .then(function () {
      return runJsTemplate(path.basename(tmpFileName, path.extname(tmpFileName)), data)
    })
}

module.exports = {
  parseJs: parseJs,
  parseJsAndWriteFile: parseJsAndWriteFile,
  runJsTemplate: runJsTemplate
}
