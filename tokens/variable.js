module.exports = class Variable {
	constructor (varname, line, column) {
		this.type = 'var'
		this.value = varname,
		this.line = line
		this.column = column
		this.keys = []
	}

	addKey (key) {
		this.keys.push(key)
	}
}
