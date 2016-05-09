var layouts = []
var lastLayout

module.exports = {
  check: function (helper, item) {
    var i = 0
    var isLayout
    var isPos

    if (item.type === 'open_tag' || item.type === 'single_tag') {
      for (;i < item.attrs.length; i += 1) {
        attr = item.attrs[i]

        if (attr.name === 'layout') {
          isLayout = attr.value
          item.attrs.splice(i, 1)
          item._layout = attr.value
          layouts.push(attr.value)
          lastLayout = attr.value
          i--
        } else if (attr.name === 'pos') {
          isPos = attr.value
          isLayout = lastLayout
          item.attrs.splice(i, 1)
          i--
        }
      }

      if (isLayout || isPos) {
        item.attrs.push({
          name: 'class',
          value: isLayout + (isPos ? '__' + isPos : '')
        })
      }
    }
  },
  closeNeste: function (item) {
    if (item.type === 'open_tag') {
      if (item._layout) {
        layouts.pop()
        lastLayout = null

        if (layouts.length) {
          lastLayout = layouts[layouts.length - 1]
        }
      }
    }
  }
}
