const parser = require('./parser')
const fs = require('fs')
const throwError = require('./helpers/throw-error')
const appendNode = require('./append-node')
const Text = require('./tokens/text')

function validateTemplateStructure (tree) {
	if (!tree.firstChild) {
		appendNode(tree, new Text('', 0, 0))
	}

	if (~tree.firstChild.type === 'tag' || tree.firstChild.name === 'component') {
		return tree.firstChild.firstChild
	}

	return tree.firstChild
}

function Parser (source, filePath, rootPath, params = {}) {
	this.source = source
	this.result = source
	this.filePath = filePath || ''
	this.rootPath = rootPath || ''
	this.params = params

	if (typeof this.source === 'string') {
		try {
			this.result = parser(this.source, params)
			this.result = validateTemplateStructure(this.result)
		} catch (e) {
			throwError(e, this.source, this.filePath, this.rootPath)
		}
	}

	return this
}

Parser.prototype.getRootPath = function () {
	return this.rootPath
}

Parser.prototype.filePath = function () {
	return this._filePath
}

Parser.prototype.stringifyWith = function (stringifier) {
	try {
		return stringifier(this.result, this.source, this.filePath, this.rootPath, this.params)
	} catch (e) {
		throwError(e, this.source, this.filePath, this.rootPath)
	}
}

module.exports = {
	parse: function (str, filePath, rootPath, params) {
		return new Parser(str, filePath, rootPath, params)
	},

	parseFile: function (filePath, rootPath, params) {
		return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath, rootPath, params)
	}
}
