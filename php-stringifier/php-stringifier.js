var logicHandler = require('./logic-handler')
var Attr = require('../parsers/attr')
var Tag = require('../parsers/tag')
var reservedTags = [
  'apply-attribute',
  'attribute',
  'apply-if',
  'if',
  'apply-for-each',
  'for-each',
  'switch',
  'case',
  'default',
  'apply-switch',
  'apply-case',
  'apply-default'
]
var pairedTags = [
  'if',
  'for-each',
  'switch',
  'case',
  'default'
]
var singleTags = ['input']
var mapAttrFragments = {}
var mapCurrentFragmentNode = {}
var prefix = require('./wrappers').prefix
var postfix = require('./wrappers').postfix
var importedComponents = []
var ParseError = require('../parsers/parse-error')
var switchMarker = {}
var switchMarkerNone = 0
var switchMarkerCase = 1 << 0
var switchMarkerDefault = 1 << 1

function linkNodeWithSwitchMarker (node) {
  switchMarker[node.id] = switchMarkerNone
}

function isFirstSwitchCase (node) {
  return switchMarker[node.parentNode.id] === switchMarkerNone
}

function setSwitchMarkerHasCase (node) {
  switchMarker[node.parentNode.id] |= switchMarkerCase
}

function isSwitchMarkerHasDefault (node) {
  return switchMarker[node.parentNode.id] & switchMarkerDefault
}

function setSwitchMarkerHasDefault (node) {
  switchMarker[node.parentNode.id] |= switchMarkerDefault
}

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
  var name
  var value

  if (attr.name) {
    name = handleNode(attr.name)
    value = attr.value === null ? 'false' : handleNode(attr.value)

    return '<?php $attrs' + id + '[' + name + '] = ' + value + ';?>'
  }

  return '<?php $attrs' + id + '[\'' + handleNode(attr.value) + '\'] = false;?>'
}

function attrsHandler (fragment, attrs) {
  var result = []
  var attrsFragment = fragment.firstChild ? handleTemplate(fragment.firstChild) : finishNode(fragment)

  attrs.forEach(function (attr) {
    result.push(attrValueHandle(attr, fragment.id))
  })

  return '<?php $attrs' + fragment.id + ' = [];?>' + result.join('') + attrsFragment
}

function linkNodeWithAttrFragment (node, fragment) {
  mapAttrFragments[node.id] = fragment
  mapCurrentFragmentNode[fragment.id] = fragment
}

function getAttrFragmentByNode (node) {
  return mapAttrFragments[node.id]
}

function getMapCurrentFragmentNode (fragment) {
  return mapCurrentFragmentNode[fragment.id]
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
    children = node.firstChild ? handleTemplate(node.firstChild) : finishNode(node)
  }

  attrs = attrsHandler(fragment, node.attrs)
  attrsOutput =
    '<?php foreach($attrs' + fragment.id + ' as $key' + fragment.id + ' => $value' + fragment.id + ')\n' +
    ' echo " " . $key' + fragment.id + ' . ($value' + fragment.id + ' !== false && $value' + fragment.id + '!== null ? "=\\"" . $value' + fragment.id + ' . "\\"" : ""); ?>'

  if (node.name === '!DOCTYPE') {
    return attrs + '<' + node.name + attrsOutput + '>'
  }

  if (node.isSingle || ~singleTags.indexOf(node.name)) {
    return attrs + '<' + node.name + attrsOutput + ' />'
  }

  return attrs + '<' + node.name + attrsOutput + '>' + children + '</' + node.name + '>'
}

function handleTagAttribute (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (!attrFragment) {
    throw new ParseError('There is no tag which <attribute /> can be applyed to', {
      line: node.line,
      column: node.column
    })
  }

  clonedNode = node.clone()

  clonedNode.name = 'apply-attribute'

  appendNodeToAttrFragment(attrFragment, clonedNode, false)

  return ''
}

function handleTagAttributeApply (node) {
  var fragment = node
  var params = extractValuesFromAttrs(node.attrs, ['name', 'value'])

  if (!params.name) {
    throw new ParseError('<attribute /> must contain `name`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  if (!params.value) {
    throw new ParseError('<attribute /> must contain `value`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  while (fragment.parentNode) {
    fragment = fragment.parentNode
  }

  return attrValueHandle(new Attr(params.name, params.value), fragment.id)
}

function handleParam (node) {
  var params = extractValuesFromAttrs(node.attrs, ['name', 'value'])
  var name
  var value

  if (!params.name) {
    throw new ParseError('<param /> must contain `name`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  if (!params.value) {
    throw new ParseError('<param /> must contain `value`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  name = handleNode(params.name)
  value = handleNode(params.value)

  return '<?php if (!isset(' + name + ')) ' + name + ' = ' + value + ';?>'
}

function getParentTagNode (node) {
  while (node.parentNode && node.parentNode.type === 'tag' && ~reservedTags.indexOf(node.parentNode.name)) {
    node = node.parentNode
  }

  return node.parentNode
}

function handleIfStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['test'])
  var content
  var parentNode = node

  while (parentNode.parentNode) {
    parentNode = parentNode.parentNode
  }

  content = node.firstChild ? handleTemplate(node.firstChild) : finishNode(node)

  if (!node.firstChild) return ''

  if (parentNode.type === 'tag' && parentNode.name === 'fragment') {
    mapCurrentFragmentNode[parentNode.id] = node.parentNode
  }

  return '<?php if (' + handleTemplate(params.test) + ') { ?>\n' + content + '<?php } ?>'
}

function handleIfStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (attrFragment) {
    clonedNode = node.clone()

    clonedNode.name = 'apply-if'

    appendNodeToAttrFragment(attrFragment, clonedNode)
  }

  return handleIfStatement(node)
}

function handleForEachStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['key', 'item', 'from'])
  var content
  var parentNode = node
  var eachStatement

  while (parentNode.parentNode) {
    parentNode = parentNode.parentNode
  }

  content = node.firstChild ? handleTemplate(node.firstChild) : finishNode(node)

  if (!node.firstChild) return ''

  if (parentNode.type === 'tag' && parentNode.name === 'fragment') {
    mapCurrentFragmentNode[parentNode.id] = node.parentNode
  }

  eachStatement = (params.key ? handleTemplate(params.key) + ' => ' : '')

  return '<?php foreach (' + handleTemplate(params.from) + ' as ' + eachStatement +
    handleTemplate(params.item) + ') { ?>' + content + '<?php } ?>'
}

function handleForEachStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (attrFragment) {
    clonedNode = node.clone()

    clonedNode.name = 'apply-for-each'

    appendNodeToAttrFragment(attrFragment, clonedNode)
  }

  return handleForEachStatement(node)
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

function prepareComponentName (name) {
  return name.replace(/\-/g, '')
}

function handleImportStatement (node) {
  var params = extractValuesFromAttrs(node.attrs, ['name', 'from'])

  if (!~params.name.value.indexOf('-')) {
    throw new ParseError('Component name must contain dash (`-`) in the name', {
      line: params.name.line,
      column: params.name.column
    })
  }

  importedComponents.push(params.name.value)

  return '<?php $__component__' + prepareComponentName(params.name.value) + ' = include(__DIR__ . "/" . ' + handleNode(params.from) + ' . ".php");?>'
}

function handleComponent (node) {
  var children = '<?php $children' + node.id + ' = "";?>'
  var attrs
  var attrsOutput
  var fragment = new Tag('fragment')

  linkNodeWithAttrFragment(node, fragment)

  if (!node.isSingle && node.firstChild) {
    children =
      '<?php ob_start(); ?>\n' +
      handleTemplate(node.firstChild) +
      '<?php $children' + node.id + ' = ob_get_contents();?>' +
      '<?php ob_end_clean(); ?>'
  }

  attrs = attrsHandler(fragment, node.attrs)
  attrsOutput = '$attrs' + fragment.id

  if (node.isSingle || ~singleTags.indexOf(node.name)) {
    return attrs + '<?php echo $__component__' + prepareComponentName(node.name) + '(' + attrsOutput + ', ""); ?>'
  }

  return attrs + children + '<?php echo $__component__' + prepareComponentName(node.name) +
    '(' + attrsOutput + ', $children' + node.id + '); ?>'
}

function handleVariable (node) {
  var params = extractValuesFromAttrs(node.attrs, ['name', 'value'])

  if (!params.name) {
    throw new ParseError('<variable /> must contain `name`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  if (!params.value) {
    throw new ParseError('<variable /> must contain `value`-attribute', {
      line: node.line,
      column: node.column
    })
  }

  return '<?php ' + handleNode(params.name) + ' = ' + handleNode(params.value) + '; ?>'
}

function handleSwitchStatement (node) {
  linkNodeWithSwitchMarker(node)

  return handleTemplate(node.firstChild) + (switchMarker[node.id] & switchMarkerCase ? '<?php } ?>' : '')
}

function handleSwitchStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (attrFragment) {
    clonedNode = node.clone()

    clonedNode.name = 'apply-switch'

    appendNodeToAttrFragment(attrFragment, clonedNode)
  }

  return handleSwitchStatement(node)
}

function handleCaseStatement (node) {
  var params
  var children

  if (node.parentNode.type !== 'tag' || (node.parentNode.name !== 'switch' && node.parentNode.name !== 'apply-switch')) {
    throw new ParseError('<case /> must be at first level inside <switch />', {line: node.line, column: node.column})
  }

  if (isSwitchMarkerHasDefault(node)) {
    throw new ParseError('<case /> must not be placed after <default />', {line: node.line, column: node.column})
  }

  children = node.firstChild ? handleTemplate(node.firstChild) : finishNode(node)
  params = extractValuesFromAttrs(node.attrs, ['test'])

  if (isFirstSwitchCase(node)) {
    setSwitchMarkerHasCase(node)

    return '<?php if (' + handleNode(params.test) + ') {' + ' ?>' + children
  }

  params = extractValuesFromAttrs(node.attrs, ['test'])

  return '<?php } else if (' + handleNode(params.test) + ') {' + ' ?>' + children
}

function handleCaseStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (attrFragment) {
    clonedNode = node.clone()

    clonedNode.name = 'apply-case'

    appendNodeToAttrFragment(attrFragment, clonedNode)
  }

  return handleCaseStatement(node)
}

function handleDefaultStatement (node) {
  var children

  if (node.parentNode.type !== 'tag' || (node.parentNode.name !== 'switch' && node.parentNode.name !== 'apply-switch')) {
    throw new ParseError('<default /> must be at first level inside <switch />', {line: node.line, column: node.column})
  }

  children = node.firstChild ? handleTemplate(node.firstChild) : finishNode(node)

  if (isFirstSwitchCase(node)) {
    setSwitchMarkerHasDefault(node)
    return children
  }

  setSwitchMarkerHasDefault(node)
  return '<?php } else {' + ' ?>' + children
}

function handleDefaultStatementNode (node) {
  var parentNode = getParentTagNode(node)
  var attrFragment = getAttrFragmentByNode(parentNode)
  var clonedNode

  if (attrFragment) {
    clonedNode = node.clone()

    clonedNode.name = 'apply-default'

    appendNodeToAttrFragment(attrFragment, clonedNode)
  }

  return handleDefaultStatement(node)
}

function handleTag (node) {
  switch (node.name) {
    case 'param':
      return handleParam(node)

    case 'variable':
      return handleVariable(node)

    case 'attribute':
      return handleTagAttribute(node)

    case 'apply-attribute':
      return handleTagAttributeApply(node)

    case 'if':
      return handleIfStatementNode(node)

    case 'apply-if':
      return handleIfStatement(node)

    case 'for-each':
      return handleForEachStatementNode(node)

    case 'apply-for-each':
      return handleForEachStatement(node)

    case 'import':
      return handleImportStatement(node)

    case 'switch':
      return handleSwitchStatementNode(node)

    case 'case':
      return handleCaseStatementNode(node)

    case 'default':
      return handleDefaultStatementNode(node)

    case 'apply-switch':
      return handleSwitchStatement(node)

    case 'apply-case':
      return handleCaseStatement(node)

    case 'apply-default':
      return handleDefaultStatement(node)

    default:
      if (~importedComponents.indexOf(node.name)) {
        return handleComponent(node)
      }

      return handleDefaultTag(node)
  }
}

function handleComment (node) {
  return '<!--' + node.value + '-->'
}

function handleText (node) {
  if (node.parentNode.name === 'switch' && node.text.trim().length) {
    throw new ParseError('Text node must not be placed inside <switch />', {
      line: node.line,
      column: node.column
    })
  }

  return node.text
}

function handleString (node) {
  return '"' + node.value + '"'
}

function logicNodeHandler (node) {
  return '<?php echo ' + logicHandler(node.expr) + ';?>'
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

  if (node.type === 'tag' && ~pairedTags.indexOf(node.name)) {
    parentNode = getParentTagNode(node)

    attrFragment = getAttrFragmentByNode(parentNode)

    if (attrFragment) {
      currentAttrNode = getMapCurrentFragmentNode(attrFragment)

      setMapCurrentFragmentNode(attrFragment, currentAttrNode.parentNode)
    }
  }

  return ''
}

function handleTemplate (node) {
  var buffer = []

  while (node) {
    buffer.push(handleNode(node))

    if (!node.nextSibling) break;

    node = node.nextSibling
  }

  if (node.parentNode) {
    finishNode(node.parentNode)
  }

  return buffer.join('')
}

module.exports = function (template) {
  var templateResult = handleTemplate(template)

  return prefix + templateResult + postfix
}
