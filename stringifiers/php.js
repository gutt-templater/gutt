function generateAttrs(attrs) {
  var result = []

  attrs.forEach(function (attr) {
    result.push((attr.name ? attr.name : attr.str) + (attr.value ? '="' + attr.value + '"' : ''))
  })

  return (result.length ? ' ' : '') + result.join(' ')
}

function generateTabs(indent) {
  var str = ''
  var i = 0

  for (;i < indent; i += 1) {
    str += '  '
  }

  return str
}

function expression(tree) {
  var str = ''

  if (typeof tree === 'string') return tree

  switch (tree.type) {
    case 'var':
      str += '$' + tree.value + tree.keys.map(function (key) {
        return '[' + expression(key) + ']'
      }).join('')

      break
    case 'num':
      str += tree.value

      break
    case 'plus':
      str += expression(tree.value[0]) + ' + ' + expression(tree.value[1])

      break
    case 'minus':
      str += expression(tree.value[0]) + ' - ' + expression(tree.value[1])

      break
    case 'mult':
      str += expression(tree.value[0]) + ' * ' + expression(tree.value[1])

      break
    case 'divis':
      str += expression(tree.value[0]) + ' / ' + expression(tree.value[1])

      break
    case 'brack':
      str += '(' + expression(tree.value) + ')'

      break
    case 'uminus':
      str += '-' + expression(tree.value)

      break
    case 'func':
      str += expression(tree.value) + '(' + tree.attrs.map(function (attr) {
        return expression(attr)
      }).join(', ') + ')'

      break
  }

  return str
}

function reduce(tree, indent) {
  indent || (indent = 0)
  var result = ''

  tree.forEach(function (node) {
    var attrs = []

    switch (node.type) {
      case 'open_tag':
        result += generateTabs(indent) + '<' + node.value + generateAttrs(node.attrs) + '>\n'
        result += reduce(node.childs, indent + 1)
        result += generateTabs(indent) + '</' + node.value + '>\n'

        break
      case 'single_tag':
        result += generateTabs(indent) + '<' + node.value + generateAttrs(node.attrs) + (node.value !== '!DOCTYPE' ? ' /' : '') + '>\n'

        break
      case 'comment':
        result += generateTabs(indent) + '<!-- ' + node.value + ' -->\n'

        break
      case 'assign':
        result += generateTabs(indent) + '<?php ' + expression(node.value) + ' = ' + expression(node.expr) + ' ?>\n'

        break
      case 'expr':
        result += generateTabs(indent) + '<?php echo ' + expression(node.value) + ' ?>'

        break
    }
  })

  return result
}

module.exports = {
  ext: 'php',
  stringify: function (tree) {
    return reduce(tree.childs)
  }
}
