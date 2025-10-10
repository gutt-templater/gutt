import chalk from 'chalk'

function indent(character, number) {
	const c = new Array(number)
	let i

	for (i = 0; i < number; i++) {
		c[i] = character
	}

	return c.join('')
}

function formatLine(str) {
	return str.replace(/\t/g, ' ')
}

export default function throwError(e, source, filePath) {
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
			previousLine = indent(' ', 3 - previousLineNumber.toString().length) + previousLineNumber + ' | ' +
			formatLine(lines[previousLineNumber - 1]) + '\n'
		}

		if (lines[nextLineNumber]) {
			nextLine = '\n' + indent(' ', 3 - nextLineNumber.toString().length) + nextLineNumber + ' | ' +
			formatLine(lines[nextLineNumber - 1]) + '\n'
		}

		currentLine = indent(' ', 3 - currentLineNumber.toString().length) + currentLineNumber + ' | ' +
		formatLine(lines[currentLineNumber - 1]) + '\n'

		arrowLine = indent(' ', 3) + ' | ' + indent(' ', column) + '^'

		throw new Error(
			chalk.red(e.message + ' ' + (filePath ? 'in ' + filePath + ':' : 'at ') +
			'(' + currentLineNumber + ':' + column + ')\n') +
			previousLine + currentLine + arrowLine + nextLine
		)
	}

	throw new Error(chalk.red(e.message) + '\n' + e.stack)
}
