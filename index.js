import fs from 'fs'
import parser from './parser.js'
import throwError from './helpers/throw-error.js'
import appendNode from './append-node.js'
import Text from './tokens/text.js'

function validateTemplateStructure(tree) {
	if (!tree.firstChild) {
		appendNode(tree, new Text('', 0, 0))
	}

	if (~tree.firstChild.type === 'tag' || tree.firstChild.name === 'component') {
		return tree.firstChild.firstChild
	}

	return tree.firstChild
}

class Parser {
	constructor(source, filePath, rootPath, params = {}) {
		this.source = source
		this.result = source
		this.path = filePath || ''
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
	}

	getRootPath() {
		return this.rootPath
	}

	filePath() {
		return this.path
	}

	stringifyWith(stringifier) {
		try {
			return stringifier(this.result, this.source, this.path, this.rootPath, this.params)
		} catch (e) {
			throwError(e, this.source, this.path, this.rootPath)
		}
	}
}

export function parse(str, filePath, rootPath, params) {
	return new Parser(str, filePath, rootPath, params)
}

export function parseFile(filePath, rootPath, params) {
	return this.parse(fs.readFileSync(filePath, 'utf-8').trim(), filePath, rootPath, params)
}
