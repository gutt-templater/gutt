function Script (attrs, body, line, column) {
	this.type = 'script'
	this.attrs = attrs
	this.body = body
	this.line = line
	this.column = column
}

module.exports = Script
