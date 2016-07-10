var blocks = []
var lastBlock

function generateClassName (block, element) {
  var className = []

  if (block) {
    className = className.concat(block)
  }

  if (element) {
    className.push({type: 'text', value: '__'})
    className = className.concat(element)
  }

  return className
}

module.exports = {
  check: function (helper, item) {
    var i = 0
    var attr
    var mods = []
    var result
    var isBlock
    var isElement

    if (item.type === 'open_tag' || item.type === 'single_tag') {
      for (; i < item.attrs.length; i += 1) {
        isBlock = false
        isElement = false
        attr = item.attrs[i]

        if (attr.name === 'block') {
          isBlock = attr.value
          item.attrs.splice(i, 1)
          item._block = isBlock
          blocks.push(isBlock)
          lastBlock = isBlock
          i--
        }

        if (attr.name === 'elem') {
          isElement = attr.value
          item.attrs.splice(i, 1)
          i--
        }

        if (attr.name === 'mod') {
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

      if (isBlock || lastBlock && isElement) {
        result = generateClassName(isBlock || lastBlock, isElement)
        item.attrs.push({
          type: 'class',
          value: result
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
