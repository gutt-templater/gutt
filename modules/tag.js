var nester = require('../nester')
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

function handleAttrs (item, modules) {
  item.attrs.forEach(function (attr) {
    if (attr.type === 'param') {
      if (attr.value) {
        attr.value = nester(attr.value, modules).childs
      } else if (attr.string) {
        attr.string = nester(attr.string, modules).childs
      }
    }
  })

  item.attrs = nester(item.attrs, modules)
}

module.exports = {
  check: function (helper, item, modules) {
    switch (item.type) {
      case 'open_tag':
        handleAttrs(item, modules)

        if (~singleTags.indexOf(item.value)) {
          item.type = 'single_tag'
        } else {
          helper.neste(item.value)
        }

        return true
      case 'close_tag':
        helper.closeNeste(item.value)

        return true
      case 'single_tag':
        handleAttrs(item, modules)

        return true
      case 'comment':

        // do nothing just catch this case
        return true
      case 'param':

        // do nothing just catch this case
        return true
    }

    return false
  }
}
