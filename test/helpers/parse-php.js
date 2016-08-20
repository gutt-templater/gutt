/* global Promise */

var path = require('path')
var fs = require('fs')
var tmpFilesDirPath = path.resolve(__dirname, '../../tmp')
var exec = require('child_process').exec
var parser = require('./parser')
var writeFile = require('./write-file')

function runPhpTemplate (templatePath, params) {
  if (!params) {
    params = {}
  }

  return new Promise(function (resolve, reject) {
    exec('php ./test/helpers/run-template.php ' + templatePath + ' \'' + JSON.stringify(params) + '\'', function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function parsePhpAndWriteFile (test, tmpFileName) {
  var resultFile

  try {
    fs.accessSync(tmpFilesDirPath, fs.F_OK)
  } catch (e) {
    fs.mkdir(tmpFilesDirPath)
  }

  resultFile = parser.parse(test, tmpFilesDirPath + '/tmp.txt').strings()

  return writeFile(path.resolve(tmpFilesDirPath, tmpFileName), resultFile.php)
}

function parsePhp (test, data) {
  var tmpFileName = 'tmp' + parseInt(Math.random() * 1000) + '.php'

  if (!data) {
    data = {}
  }

  return parsePhpAndWriteFile(test, tmpFileName)
  .then(function () {
    return runPhpTemplate(path.basename(tmpFileName, path.extname(tmpFileName)), data)
  })
}

module.exports = {
  parsePhp: parsePhp,
  parsePhpAndWriteFile: parsePhpAndWriteFile,
  runPhpTemplate: runPhpTemplate
}
