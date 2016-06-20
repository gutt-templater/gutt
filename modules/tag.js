var nester = require('../nester')
var singleTags = ['!DOCTYPE', 'meta', 'hr']

function handleAttrs(item, modules) {
  if (item.attrs.length) {
    item.attrs.forEach(function (attr) {
      if (attr.value.length) {
        attr.value = nester(attr.value, modules)
      } else {
        attr.value = {
          childs: [],
          type: 'root'
        }
      }
    })
  }
}

module.exports = {
  check: function (helper, item, modules) {
    var checked = true

    switch (item.type) {
      case 'open_tag':
        handleAttrs(item, modules)

        if (~singleTags.indexOf(item.value)) {
          item.type = 'single_tag'
        } else {
          helper.neste(item.value)
        }

        break
      case 'close_tag':
        helper.closeNeste(item.value)

        break
      case 'single_tag':
        handleAttrs(item, modules)

        if (!~singleTags.indexOf(item.value)) {
          item.type = 'open_tag'
        }

        break
      case 'comment':
        // do nothing just catch this case

        break
      default:
        checked = false
    }

    return checked
  }
}
