const chalk = require('chalk')

function o (character, number) {
	let i
	const c = new Array(number)

	for (i = 0; i < number; i++) {
		c[i] = character
	}

	return c.join('')
}

function prepareLine (str) {
	return str.replace(/\t/g, ' ')
}

function throwError (e, source, filePath) {
	let lines
	let previousLineNumber
	let currentLineNumber
	let nextLineNumber
	let previousLine = ''
	let currentLine
	let arrowLine
	let nextLine = ''
	let column

	if (typeof e.line !== 'undefined' && typeof e.column !== 'undefined') {
		lines = source.split(/\n/g)
		currentLineNumber = e.line
		previousLineNumber = currentLineNumber - 1
		nextLineNumber = currentLineNumber + 1
		column = e.column

		if (previousLineNumber) {
			previousLine = o(' ', 3 - previousLineNumber.toString().length) + previousLineNumber + ' | ' +
			prepareLine(lines[previousLineNumber - 1]) + '\n'
		}

		if (lines[nextLineNumber]) {
			nextLine = '\n' + o(' ', 3 - nextLineNumber.toString().length) + nextLineNumber + ' | ' +
			prepareLine(lines[nextLineNumber - 1]) + '\n'
		}

		currentLine = o(' ', 3 - currentLineNumber.toString().length) + currentLineNumber + ' | ' +
		prepareLine(lines[currentLineNumber - 1]) + '\n'

		arrowLine = o(' ', 3) + ' | ' + o(' ', column) + '^'

		throw new Error(
			chalk.red(e.message + ' ' + (filePath ? 'in ' + filePath + ':' : 'at ') +
			'(' + currentLineNumber + ':' + column + ')\n') +
			previousLine + currentLine + arrowLine + nextLine
		)
	}

	throw new Error(chalk.red(e.message) + '\n' + e.stack)
}

module.exports = throwError
