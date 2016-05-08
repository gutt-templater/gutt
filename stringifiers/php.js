var inlineNodes = [
  'b', 'big', 'i', 'small', 'tt', 'time', 'var',
  'abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp',
  'a', 'bdo', 'br', 'img', 'map', 'object', 'q', 'span', 'sub', 'sup',
  'button, label, textarea', 'title', 'li'
]

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
    case 'or':
      str += expression(tree.value[0]) + ' || ' + expression(tree.value[1])

      break
    case 'and':
      str += expression(tree.value[0]) + ' && ' + expression(tree.value[1])

      break
    case 'bitor':
      str += expression(tree.value[0]) + ' | ' + expression(tree.value[1])

      break
    case 'bitand':
      str += expression(tree.value[0]) + ' & ' + expression(tree.value[1])

      break
    case 'notequal':
      str += expression(tree.value[0]) + ' != ' + expression(tree.value[1])

      break
    case 'equal':
      str += expression(tree.value[0]) + ' == ' + expression(tree.value[1])

      break
    case 'gtequal':
      str += expression(tree.value[0]) + ' >= ' + expression(tree.value[1])

      break
    case 'gt':
      str += expression(tree.value[0]) + ' > ' + expression(tree.value[1])

      break
    case 'lt':
      str += expression(tree.value[0]) + ' < ' + expression(tree.value[1])

      break
    case 'ltequal':
      str += expression(tree.value[0]) + ' <= ' + expression(tree.value[1])

      break
    case 'not':
      str += '!' + expression(tree.value[0])

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
        result += generateTabs(indent) + '<' + node.value + generateAttrs(node.attrs) + '>' + (!~inlineNodes.indexOf(node.value) ? '\n' : '')
        result += reduce(node.childs, indent + 1)
        result += (!~inlineNodes.indexOf(node.value) ? generateTabs(indent) : '') + '</' + node.value + '>\n'

        break
      case 'single_tag':
        result += generateTabs(indent) + '<' + node.value + generateAttrs(node.attrs) + (node.value !== '!DOCTYPE' ? ' /' : '') + '>\n'

        break
      case 'comment':
        result += generateTabs(indent) + '<!-- ' + node.value + ' -->\n'

        break
      case 'assign':
        result += generateTabs(indent) + '<?php ' + expression(node.value) + ' = ' + expression(node.expr) + '; ?>\n'

        break
      case 'if':
        result += generateTabs(indent) + '<?php if (' + expression(node.value) + ') { ?>\n'
        result += reduce(node.childs, indent + 1)

        break
      case 'elseif':
        result += generateTabs(indent) + '<?php } elseif (' + expression(node.value) + ') { ?>\n'
        result += reduce(node.childs, indent + 1)

        break
      case 'else':
        result += generateTabs(indent) + '<?php } else { ?>\n'
        result += reduce(node.childs, indent + 1)

        break
      case 'endif':
        result += generateTabs(indent - 1) + '<?php } ?>\n'

        break
      case 'for':
        result += generateTabs(indent - 1) + '<?php foreach ('

        if (node.value.length === 2) {
          result += expression(node.value[1]) + ' as ' + expression(node.value[0])
        } else if (node.value.length === 3) {
          result += expression(node.value[2]) + ' as ' + expression(node.value[0]) +
            ' => ' + expression(node.value[1])
        }

        result += ') { ?>\n'
        result += reduce(node.childs, indent + 1)

        result += generateTabs(indent - 1) + '<?php } ?>\n'

        break
      case 'expr':
        result += generateTabs(indent) + '<?php echo ' + expression(node.value) + '; ?>\n'

        break
      case 'text':
        result += node.value.trim()
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
