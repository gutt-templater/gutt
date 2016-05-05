function joinerMods(mods, className) {
  return mods.map(function (mod) {
    return className + '--' + mod
  }).join(' ')
}

function generateClassName(block, element, mods) {
  var className = (block ? block : '') + (element ? '__' + element : '')

  return className + (mods.length ? ' ' + joinerMods(mods, className) : '')
}

var blocks = []
var lastBlock

module.exports = {
  check: function (helper, item) {
    var i = 0
    var attr
    var isBlock = false
    var isElement = false
    var mods = []

    if (item.type === 'open_tag' || item.type === 'single_tag') {
      for (;i < item.attrs.length; i += 1) {
        attr = item.attrs[i]

        if (attr.name === 'block') {
          isBlock = attr.value
          item.attrs.splice(i, 1)
          item._block = attr.value
          blocks.push(attr.value)
          lastBlock = attr.value
          i--
        } else if (attr.name === 'elem') {
          isElement = attr.value
          isBlock = lastBlock
          item.attrs.splice(i, 1)
          i--
        } else if (attr.name === 'mods') {
          mods = attr.value.split(' ')
          mods = mods.map(function (mod) {
            if (~mod.indexOf(':')) {
              mod = mod.replace(':', '_')
            }

            return mod
          })
          item.attrs.splice(i, 1)
          i--
        }
      }

      if (isBlock || isElement) {
        item.attrs.push({
          name: 'class',
          value: generateClassName(isBlock, isElement, mods)
        })
      }
    }
  },
  closeNeste: function (item) {
    if (item.type === 'open_tag') {
      if (item._block) {
        blocks.pop()
        lastBlock = null

        if (blocks.length) {
          lastBlock = blocks[blocks.length - 1]
        }
      }
    }
  }
}
