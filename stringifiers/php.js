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
