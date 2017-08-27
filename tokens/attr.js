let id = 1

function Attr (name, value) {
	this.type = 'attr'
	this.name = name
	this.value = value
	this.id = id++
}

module.exports = Attr
