var chalk = require('chalk')

function o (character, number) {
  var i;
  var c

  if (!number) {
    number = 1
  }

  c = new Array(number - 1)

  for (i = 0; i < number; i++) {
    c[i] = character
  }

  return c.join('')
}

function throwError (e, source, filePath, rootPath) {
  var lines
  var previousLineNumber
  var currentLineNumber
  var nextLineNumber
  var previousLine = ''
  var currentLine
  var arrowLine
  var nextLine = ''
  var column

  if (e.hash && e.hash.line && e.hash.column) {
    lines = source.split(/\n/g)
    currentLineNumber = e.hash.line
    previousLineNumber = currentLineNumber - 1
    nextLineNumber = currentLineNumber + 1
    column = e.hash.column

    if (previousLineNumber) {
      previousLine = o(' ', 3 - previousLineNumber.toString().length) + previousLineNumber + ' | ' + lines[previousLineNumber - 1] + '\n'
    }

    if (lines[nextLineNumber]) {
      nextLine = '\n' + o(' ', 3 - nextLineNumber.toString().length) + nextLineNumber + ' | ' + lines[nextLineNumber - 1] + '\n'
    }

    currentLine = o(' ', 3 - currentLineNumber.toString().length) + currentLineNumber + ' | ' + lines[currentLineNumber - 1] + '\n'

    arrowLine = o(' ', 3) + ' | ' + o(' ', column) + '^'

    console.log(
      chalk.red(e.message + ' ' + (filePath ? 'in ' + filePath + ':' : 'at ') +
      '(' + currentLineNumber + ':' + column + ')\n') +
      previousLine + currentLine + arrowLine + nextLine
    )
  }

  console.log(chalk.red(e.message))
}

module.exports = throwError
