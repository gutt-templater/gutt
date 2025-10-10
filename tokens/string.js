export default class Str {
	constructor(value, line, column) {
		this.type = 'string'
		this.value = value
		this.line = line
		this.column = column
	}
}
