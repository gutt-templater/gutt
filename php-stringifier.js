var logicHandler = require('./logic-handler')
var Attr = require('./parsers/attr')
var Tag = require('./parsers/tag')
var Str = require('./parsers/string')
var reservedTags = [
  'x:param'
]
var mapAttrFragments = {}
var mapCurrentFragmentNode = {}

function attrValueHandle (attr, id) {
  var name = handleNode(attr.name)
  var value = attr.value === null ? 'false' : handleNode(attr.value)

  return '$attrs' + id + '[' + name + '] = ' + value + ';'
}

function attrsHandler (fragment, attrs) {
  var result = []
  var attrsFragment = fragment.firstNode ? phpStringifier(fragment.firstNode) : ''

  attrs.forEach(function (attr) {
    result.push(attrValueHandle(attr, fragment.id))
  })

  return '<?php $attrs' + fragment.id + ' = []; ' + result.join(' ') + attrsFragment + ' ?>'
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

function defaultTagHandler (node) {
  var children = ''
  var attrs
  var attrsOutput
  var fragment = new Tag('fragment')

  linkNodeWithAttrFragment(node, fragment)

  if (!node.isSingle) {
    children = node.firstNode ? phpStringifier(node.firstNode) : ''
  }

  attrs = attrsHandler(fragment, node.attrs)
  attrsOutput =
    ' <?php foreach($attrs' + fragment.id + ' as $key' + fragment.id + ' => $value' + fragment.id + ')' +
    ' echo " " . $key' + fragment.id + ' . ($value' + fragment.id + ' ? "=\\"" . $value' + fragment.id + ' . "\\"" : ""); ?>'

  if (node.isSingle) {
    return attrs + '<' + node.name + attrsOutput + ' />'
  }

  return attrs + '<' + node.name + attrsOutput + '>' + children + '</' + node.name + '>'
}

function handleTagParam (node) {
  var attrFragment
  var currentAttrNode
  var clonedNode = node.clone()

  clonedNode.name = 'x:apply-param'

  while (node.parentNode && node.parentNode.type === 'tag' && ~reservedTags.indexOf(node.parentNode.name)) {
    node = node.parentNode
  }

  node = node.parentNode

  attrFragment = getAttrFragmentByNode(node)
  currentAttrNode = getMapCurrentFragmentNode(attrFragment)

  clonedNode.parentNode = currentAttrNode

  if (!currentAttrNode.firstNode) {
    currentAttrNode.firstNode = clonedNode
  }

  if (currentAttrNode.lastNode) {
    currentAttrNode.lastNode.nextNode = clonedNode
    clonedNode.prevNode = currentAttrNode.lastNode
  }

  currentAttrNode.lastNode = clonedNode

  return ''
}

function handleTagParamApply (node) {
  var fragment = node
  var name
  var value = null

  while (fragment.parentNode) {
    fragment = fragment.parentNode
  }

  node.attrs.forEach(function (attr) {
    if (attr.name.type === 'string' && attr.name.value === 'name') {
      name = attr.value
    }

    if (attr.name.type === 'string' && attr.name.value === 'value') {
      value = attr.value
    }
  })

  return ' ' + attrValueHandle(new Attr(name, value), fragment.id)
}

function handleTag (node) {
  switch (node.name) {
    case 'x:param':
      return handleTagParam(node)

    case 'x:apply-param':
      return handleTagParamApply(node)

    default:
      return defaultTagHandler(node)
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
  }
}

function phpStringifier (node) {
  var buffer = []

  buffer.push(handleNode(node))

  while (node.nextNode) {
    node = node.nextNode
    buffer.push(handleNode(node))
  }

  return buffer.join('')
}

module.exports = function (tree) {
  return phpStringifier(tree.firstNode)
}
