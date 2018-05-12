let id = 0

function Script (attrs, body, line, column) {
	this.type = 'script'
	this.attrs = attrs
	this.body = body
	this.line = line
	this.column = column
	this.id = id++
}

module.exports = Script
