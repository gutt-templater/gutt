module.exports = class Func {
	constructor (funcName) {
		this.type = 'func'
		this.value = funcName
		this.attrs = []
	}

	addAttr (attr) {
		this.attrs.push(attr)
	}
}
