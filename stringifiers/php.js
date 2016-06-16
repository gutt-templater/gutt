function generateAttrs(attrs) {
  var result = []

  attrs.forEach(function (attr) {
    var attrValue = ''

    attr.value.forEach(function (value) {
      attrValue += reduce([value], 0)
    })

    result.push(attr.name + (attrValue.length ? '="' + attrValue + '"' : ''))
  })

  return (result.length ? ' ' : '') + result.join(' ')
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

function reduce(tree) {
  var result = ''

  tree.forEach(function (node) {
    var attrs = []

    switch (node.type) {
      case 'open_tag':
        result += '<' + node.value + generateAttrs(node.attrs) + '>'
        result += reduce(node.childs)
        result += '</' + node.value + '>'

        break
      case 'single_tag':
        result += '<' + node.value + generateAttrs(node.attrs) + (node.value !== '!DOCTYPE' ? ' /' : '') + '>'

        break
      case 'comment':
        result += '<!-- ' + node.value + ' -->'

        break
      case 'assign':
        result += '<?php ' + expression(node.value) + ' = ' + expression(node.expr) + '; ?>'

        break
      case 'if':
        result += '<?php if (' + expression(node.value) + ') { ?>'
        result += reduce(node.childs)

        break
      case 'elseif':
        result += '<?php } elseif (' + expression(node.value) + ') { ?>'
        result += reduce(node.childs)

        break
      case 'else':
        result += '<?php } else { ?>'
        result += reduce(node.childs)

        break
      case 'endif':
        result += '<?php } ?>'

        break
      case 'for':
        result += '<?php foreach ('

        if (node.value.length === 2) {
          result += expression(node.value[1]) + ' as ' + expression(node.value[0])
        } else if (node.value.length === 3) {
          result += expression(node.value[2]) + ' as ' + expression(node.value[0]) +
            ' => ' + expression(node.value[1])
        }

        result += ') { ?>'
        result += reduce(node.childs)

        result += '<?php } ?>'

        break
      case 'expr':
        result += '<?php echo ' + expression(node.value) + '; ?>'

        break
      case 'text':
        result += node.value
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
