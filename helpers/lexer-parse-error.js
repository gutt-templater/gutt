import ParseError from './parse-error'

export default function parseError(str, hash) {
	hash.column = this.yylloc.last_column
	str = 'Unexpected token'

	throw new ParseError(str, hash)
}
