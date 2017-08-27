function ParseError (msg, position) {
	this.message = msg
	this.line = position.line
	this.column = position.column
}

ParseError.prototype = Error

module.exports = ParseError
