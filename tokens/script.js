let id = 0

export default class Script {
	constructor(attrs, body, line, column) {
		this.type = 'script'
		this.attrs = attrs
		this.body = body
		this.line = line
		this.column = column
		this.id = id++
	}
}
