const reservedTags = [
	'attribute',
	'case',
	'default',
	'for-each',
	'if',
	'import',
	'param',
	'switch',
	'template',
	'variable'
]

module.exports = function appendNode (currentNode, node) {
	const isTag = node.type === 'tag'
	const isReservedOrComponentName = isTag && (~reservedTags.indexOf(node.name) || ~node.name.indexOf('-'))
	const isLastChildIsFirstChild = isTag && currentNode.name === 'component' && currentNode.firstChild === currentNode.lastChild
	const isLogic = node.type === 'logic-node' || node.type === 'logic'

	if (isReservedOrComponentName || isLastChildIsFirstChild || isLogic) {
		if (currentNode.lastChild && currentNode.lastChild.type === 'text' && !currentNode.lastChild.text.trim().length) {
			if (currentNode.lastChild.previousSibling) {
				currentNode.lastChild = currentNode.lastChild.previousSibling
			} else {
				currentNode.lastChild = null
				currentNode.firstChild = null
			}
		}
	}

	node.parentNode = currentNode

	if (!currentNode.firstChild) {
		currentNode.firstChild = node
	}

	if (currentNode.lastChild) {
		currentNode.lastChild.nextSibling = node
		node.previousSibling = currentNode.lastChild
	}

	currentNode.lastChild = node
}
