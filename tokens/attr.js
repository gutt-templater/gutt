let id = 1

export default class Attr {
	constructor (name, value) {
		this.type = 'attr'
		this.name = name
		this.value = value
		this.id = id++
	}
}
