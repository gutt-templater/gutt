var nester = require('../nester')
var singleTags = ['!DOCTYPE', 'meta', 'hr']

function handleAttrs (item, modules) {
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

        if (!~singleTags.indexOf(item.value)) {
          item.type = 'open_tag'
        }

        return true
      case 'comment':

        // do nothing just catch this case
        return true
    }

    return false
  }
}
