var logicHandler = require('./logic-handler')
var Attr = require('../parsers/attr')
var Tag = require('../parsers/tag')
var reservedTags = [
  'x:apply-param',
  'x:param',
  'x:apply-if',
  'x:if',
  'x:apply-for',
  'x:for'
]
var singleTags = ['input']
var mapAttrFragments = {}
var mapCurrentFragmentNode = {}
var prefix = require('./wrappers').prefix
var postfix = require('./wrappers').postfix
var importedComponents = []

function extractValuesFromAttrs (attrs, fields) {
  var result = {}

  attrs.forEach(function (attr) {
    if (attr.name.type === 'string' && ~fields.indexOf(attr.name.value)) {
      result[attr.name.value] = attr.value
    }
  })

  return result
}

function attrValueHandle (attr, id) {
  var name = handleNode(attr.name)
  var value = attr.value === null ? 'false' : handleNode(attr.value)

  return '<?php $attrs' + id + '[' + name + '] = ' + value + ';?>\n'
}

function attrsHandler (fragment, attrs) {
  var result = []
  var attrsFragment = fragment.firstChild ? phpStringifier(fragment.firstChild) : ''

  attrs.forEach(function (attr) {
    result.push(attrValueHandle(attr, fragment.id))
  })

  return '<?php $attrs' + fragment.id + ' = [];?>' + result.join('') + attrsFragment + '\n'
}

function linkNodeWithAttrFragment (node, fragment) {
  mapAttrFragments[node.id] = fragment
  mapCurrentFragmentNode[fragment.id] = fragment
}

function getAttrFragmentByNode (node) {
  return mapAttrFragments[node.id]
}

function getMapCurrentFragmentNode (fragment) {
  return mapCurrentFragmentNode[fragment.id];
}

function setMapCurrentFragmentNode (attrFragment, node) {
  mapCurrentFragmentNode[attrFragment.id] = node
}

function handleDefaultTag (node) {
  var children = ''
  var attrs
  var attrsOutput
  var fragment = new Tag('fragment')

  linkNodeWithAttrFragment(node, fragment)

  if (!node.isSingle) {
    children = node.firstChild ? phpStringifier(node.firstChild) : ''
  }

  attrs = attrsHandler(fragment, node.attrs)
  attrsOutput =
    ' <?php foreach($attrs' + fragment.id + ' as $key' + fragment.id + ' => $value' + fragment.id + ')\n' +
    ' echo " " . $key' + fragment.id + ' . ($value' + fragment.id + ' ? "=\\"" . $value' + fragment.id + ' . "\\"" : ""); ?>\n'

  if (node.isSingle || ~singleTags.indexOf(node.name)) {
    return attrs + '<' + node.name + attrsOutput + ' />'
  }

  return attrs + '<' + node.name + attrsOutput + '>' + children + '</' + node.name + '>'
}

function handleTagParam (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode = node.clone()

  clonedNode.name = 'x:apply-param'

  appendNodeToAttrFragment(attrFragment, clonedNode, false)

  return ''
}

function handleTagParamApply (node) {
  var fragment = node
  var params = extractValuesFromAttrs(node.attrs, ['name', 'value'])

  while (fragment.parentNode) {
    fragment = fragment.parentNode
  }

  return ' ' + attrValueHandle(new Attr(params.name, params.value), fragment.id)
}

function handleIfStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['test'])
  var content
  var parentNode = node

  while (parentNode.parentNode) {
    parentNode = parentNode.parentNode
  }

  if (!node.firstChild) return ''

  content = phpStringifier(node.firstChild)

  if (parentNode.type === 'tag' && parentNode.name === 'fragment') {
    mapCurrentFragmentNode[parentNode.id] = node.parentNode
  }

  return '<?php if (' + phpStringifier(params.test) + ') { ?>\n' + content + '<?php } ?>\n'
}

function getParentTagNode (node) {
  while (node.parentNode && node.parentNode.type === 'tag' && ~reservedTags.indexOf(node.parentNode.name)) {
    node = node.parentNode
  }

  return node.parentNode
}

function handleIfStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode = node.clone()

  clonedNode.name = 'x:apply-if'

  appendNodeToAttrFragment(attrFragment, clonedNode)

  return handleIfStatement(node)
}

function handleForStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['key', 'value', 'from'])
  var content
  var parentNode = node
  var eachStatement

  while (parentNode.parentNode) {
    parentNode = parentNode.parentNode
  }

  if (!node.firstChild) return ''

  content = phpStringifier(node.firstChild)

  if (parentNode.type === 'tag' && parentNode.name === 'fragment') {
    mapCurrentFragmentNode[parentNode.id] = node.parentNode
  }

  eachStatement = (params.key ? phpStringifier(params.key) + ' => ' : '')

  return '<?php foreach (' + phpStringifier(params.from) + ' as ' + eachStatement +
    phpStringifier(params.value) + ') { ?>\n' + content + '<?php } ?>\n'
}

function appendNodeToAttrFragment (attrFragment, node, isSetNodeAsCurrentNodeAtFragment) {
  var currentAttrNode = getMapCurrentFragmentNode(attrFragment)

  if (typeof isSetNodeAsCurrentNodeAtFragment === 'undefined') {
    isSetNodeAsCurrentNodeAtFragment = true
  }

  node.parentNode = currentAttrNode

  if (!currentAttrNode.firstChild) {
    currentAttrNode.firstChild = node
  }

  if (currentAttrNode.lastChild) {
    currentAttrNode.lastChild.nextSibling = node
    node.previousSibling = currentAttrNode.lastChild
  }

  currentAttrNode.lastChild = node

  if (isSetNodeAsCurrentNodeAtFragment) {
    setMapCurrentFragmentNode(attrFragment, node)
  }
}

function handleForStatementNode (node) {
  var clonedNode = node.clone()
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)

  clonedNode.name = 'x:apply-for'

  appendNodeToAttrFragment(attrFragment, clonedNode)

  return handleForStatement(node)
}

function handleImportStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['name', 'from'])

  importedComponents.push(params.name.value)

  return '<?php $__components[' + handleNode(params.name) + '] = include(__DIR__ . "/" . ' + handleNode(params.from) + ' . ".php");?>\n'
}

function handleComponent (node) {
  var children = '<?php $children' + node.id + ' = "";\n?>'
  var attrs
  var attrsOutput
  var fragment = new Tag('fragment')

  linkNodeWithAttrFragment(node, fragment)

  if (!node.isSingle) {
    children =
      '<?php ob_start(); ?>\n' +
      (node.firstChild ? phpStringifier(node.firstChild) : '') +
      '<?php $children' + node.id + ' = ob_get_contents();\n?>' +
      '<?php ob_end_clean(); ?>'
  }

  attrs = attrsHandler(fragment, node.attrs)
  attrsOutput = '$attrs' + fragment.id

  if (node.isSingle || ~singleTags.indexOf(node.name)) {
    return attrs + '<?php $__components["' + node.name.substr(2) + '"](' + attrsOutput + ', ""); ?>\n'
  }

  return attrs + children + '<?php echo $__components["' + node.name.substr(2) + '"]' +
    '(' + attrsOutput + ', $children' + node.id + '); ?>\n'
}

function handleVarParam (node) {
  var params = extractValuesFromAttrs(node.attrs, ['name', 'value'])

  return '<?php ' + handleNode(params.name) + ' = ' + handleNode(params.value) + '; ?>\n'
}

function handleTag (node) {
  var tagName

  switch (node.name) {
    case 'x:var':
      return handleVarParam(node)

    case 'x:param':
      return handleTagParam(node)

    case 'x:apply-param':
      return handleTagParamApply(node)

    case 'x:if':
      return handleIfStatementNode(node)

    case 'x:apply-if':
      return handleIfStatement(node)

    case 'x:for':
      return handleForStatementNode(node)

    case 'x:apply-for':
      return handleForStatement(node)

    case 'x:import':
      return handleImportStatement(node)

    default:
      tagName = node.name.match(/^x\:(.*)$/)

      if (tagName && ~importedComponents.indexOf(tagName[1])) {
        return handleComponent(node)
      }

      return handleDefaultTag(node)
  }
}

function handleComment (node) {
  return '<!-- ' + node.value + ' -->'
}

function handleText (node) {
  return node.text
}

function handleString (node) {
  return '"' + node.value + '"'
}

function logicNodeHandler (node) {
  return '<?php echo ' + logicHandler(node.expr) + ';?>\n';
}

function handleNode (node) {
  switch (node.type) {
    case 'tag':
      return handleTag(node)
    case 'comment':
      return handleComment(node)
    case 'text':
      return handleText(node)
    case 'string':
      return handleString(node)
    case 'logic':
      return logicHandler(node)
    case 'logic-node':
      return logicNodeHandler(node)
  }
}

function finishNode (node) {
  var attrFragment
  var currentAttrNode
  var parentNode

  if (node.type === 'tag' && (node.name === 'x:if' || node.name === 'x:for')) {
    parentNode = getParentTagNode(node)

    attrFragment = getAttrFragmentByNode(parentNode)
    currentAttrNode = getMapCurrentFragmentNode(attrFragment)

    setMapCurrentFragmentNode(attrFragment, currentAttrNode.parentNode)
  }
}

function phpStringifier (node) {
  var buffer = []

  buffer.push(handleNode(node))

  while (node.nextSibling) {
    node = node.nextSibling
    buffer.push(handleNode(node))
  }

  if (node.parentNode) {
    finishNode(node.parentNode)
  }

  return buffer.join('')
}

module.exports = function (tree) {
  return prefix + phpStringifier(tree.firstChild) + postfix
}
