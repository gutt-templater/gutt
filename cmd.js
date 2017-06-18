#!/usr/bin/env node

// jscs:disable requireVarDeclFirst
var path = require('path')
var gutt = require('./index')
var yargs = require('yargs')
var fs = require('fs')
var argvs
var files
var stringifier
var output
var stringifiers = []
var template
var cwd
var currentOutput

argvs = yargs
.usage('Usage: gutt <files ...> [options]')
.help('h')
.alias('h', 'help')
.alias('s', 'stringify')
.alias('o', 'out-put')
.alias('v', 'version')
.demandOption(['s'])
.describe('s', 'name of stringifier without prefix `gutt-`')
.describe('o', 'out-put path')
.describe('cwd', 'cwd for the output folder')
.example('gutt templates/*.{gutt,tmplt} -s node-stringifier -o dist/templates/')
.example('gutt templates/ -s node-stringifier -o dist/node-templates/ -s \\ browser-stringifier -o dist/js-templates/')
.example('gutt components/**/*.gutt templates/*.gutt -s node-stringifier -o dist')
.version(function () {
  return 'v' + require('./package.json').version;
})
.argv

files = argvs._
stringifier = argvs.s
output = argvs.o
cwd = argvs.cwd

if (!output) output = []

if (!cwd) cwd = []

if (typeof files === 'string') files = [files]

if (typeof stringifier === 'string') stringifier = [stringifier]

if (typeof output === 'string') output = [output]

if (typeof cwd === 'string') cwd = [cwd]

if (!files.length) {
  throw new Error('No input files given. Check gutt --help')
}

if (stringifier.length > 1 && output.length > 1 && stringifier.length !== output.length) {
  throw new Error('Out-put amount should be equal strinfigiers amount or equal 1 or equal 0')
}

stringifier.forEach(function (stringifier) {
  stringifier = {
    handler: require(path.resolve(process.cwd(), './node_modules/gutt-' + stringifier)),
    meta: require(path.resolve(process.cwd(), './node_modules/gutt-' + stringifier + '/package.json'))
  }

  if (!stringifier.meta.CLISupport) {
    throw new Error(stringifier.meta.title + ' does not support CLI')
  }

  stringifiers.push(stringifier)
})

function getOutputPath (filePath) {
  var cwdPropped = false

  cwd.forEach(function (cwd) {
    cwd = path.normalize(cwd)
    filePath = path.normalize(filePath)

    if (filePath.indexOf(cwd) === 0 && !cwdPropped) {
      filePath = filePath.substr(cwd.length + 1)

      cwdPropped = true
    }
  })

  return filePath
}

function mkdirRecoursive (output, dirname) {
  var cwd = process.cwd()

  output = output.split(path.sep).concat(path.normalize(dirname).split(path.sep))

  output.forEach(function (dirname) {
    cwd = path.resolve(cwd, dirname)

    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd, 0777)
    }
  })
}

stringifiers.forEach(function (stringifier, index) {
  files.forEach(function (filePath) {
    template = gutt.parseFile(filePath).stringifyWith(stringifier.handler)

    if (output.length) {
      currentOutput = output[0]

      if (output.length > 1) {
        output[0] = output[index]
      }

      filePath = getOutputPath(filePath) + '.' + stringifier.meta.ext

      mkdirRecoursive(currentOutput, path.dirname(filePath))

      filePath = path.resolve(process.cwd(), currentOutput, filePath)

      fs.writeFile(filePath, template)

      console.log(filePath)
    } else {
      console.log(template)
    }
  })
})
