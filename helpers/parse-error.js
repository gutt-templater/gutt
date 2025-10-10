export default class ParseError extends Error {
	constructor(msg, position) {
		super()

		this.message = msg
		this.line = position.line
		this.column = position.column
	}
}
