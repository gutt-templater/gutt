const ParseError = require('./parse-error')

module.exports = function parseError (str, hash) {
	hash.column = this.yylloc.last_column
	str = 'Unexpected token'

	throw new ParseError(str, hash)
}
