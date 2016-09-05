var Parser = require('../parsers/parser')
var singleTags = [
  '!DOCTYPE',
  'area',
  'base',
  'br',
  'col',
  'embed',
  'frame',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track'
]

function handleAttrs (tree, item) {
  var parser = Parser(tree.modules())

  item.attrs.forEach(function (attr) {
    if (attr.type === 'param') {
      if (attr.value) {
        if (attr.value && attr.value.type && attr.value.type === 'logic') {
          attr.value = parser.parse([attr.value], tree.filePath()).tree()
        } else {
          attr.value = parser.parse(attr.value, tree.filePath()).tree()
        }
      } else if (attr.string) {
        attr.string = parser.parse(attr.string, tree.filePath()).tree()
      }
    }
  })

  item.attrs = parser.parse(item.attrs, tree.filePath()).tree()
}

module.exports = {
  check: function (tree, item) {
    switch (item.type) {
      case 'open_tag':
        handleAttrs(tree, item)

        if (~singleTags.indexOf(item.value)) {
          item.type = 'single_tag'
          tree.push(item)
        } else {
          item.type = 'tag'
          tree.open(item, item.value)
        }

        return true
      case 'close_tag':
        tree.close(item.value)

        return true
      case 'single_tag':
        handleAttrs(tree, item)
        tree.push(item)

        return true
      case 'comment':
        tree.push(item)

        // do nothing just catch this case
        return true
      case 'param':
        tree.push(item)

        // do nothing just catch this case
        return true
    }

    return false
  }
}
