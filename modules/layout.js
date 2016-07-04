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

        if (attr.name === 'layout' && attr.value.length === 1 && attr.value[0].type === 'text') {
          isLayout = attr.value[0].value
          item.attrs.splice(i, 1)
          item._layout = isLayout
          layouts.push(isLayout)
          lastLayout = isLayout
          i--
        } else if (attr.name === 'pos' && attr.value.length === 1 && attr.value[0].type === 'text') {
          isPos = attr.value[0].value
          item.attrs.splice(i, 1)
          i--
        }
      }

      if (isLayout || lastLayout && isPos) {
        item.attrs.push({
          name: 'class',
          value: [{type: 'text', value: (isLayout || lastLayout) + (isPos ? '__' + isPos : '')}]
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
