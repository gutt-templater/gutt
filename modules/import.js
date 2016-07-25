var path = require('path')
var cacheTemplates = {}

function setParent (parent, item) {
  item.parent = parent
}

module.exports = {
  check: function (tree, item) {
    var funcParams
    var includePath
    var nameSpace = tree.filePath()
    var i
    var len
    var parent
    var currentNode
    var includeNode

    if (tree.match(item, 'type[logic].type[expr].type[func].type[var].import')) {
      funcParams = item.value.value.attrs

      if (!funcParams[0] || funcParams[0].type !== 'var' || funcParams[0].keys.length) {
        throw new Error('Syntax error: wrong component name')
      }

      if (!funcParams[1] || typeof funcParams[1] !== 'string') {
        throw new Error('Syntax error: wrong component path. Should by string')
      }

      includePath = funcParams[1].substr(1, funcParams[1].length - 2)

      includePath = path.resolve(path.dirname(nameSpace), includePath)

      if (!cacheTemplates[includePath]) {
        cacheTemplates[includePath] = {
          names: {}
        }
      }

      if (!cacheTemplates[includePath].names[nameSpace]) {
        cacheTemplates[includePath].names[nameSpace] = []
      }

      cacheTemplates[includePath].names[nameSpace].push(funcParams[0].value)

      tree.skip()
    } else if (item.type === 'close_tag' || item.type === 'single_tag') {
      for (includePath in cacheTemplates) {
        if (cacheTemplates[includePath].names[nameSpace]) {
          for (i = 0, len = cacheTemplates[includePath].names[nameSpace].length; i < len; i += 1) {
            if (cacheTemplates[includePath].names[nameSpace][i] === item.value) {
              currentNode = tree.currentNode

              if (item.type === 'single_tag') {
                currentNode = item
              }

              if (!currentNode.childs) {
                currentNode.childs = []
              }

              parent = currentNode.parent
              includeNode = {
                type: 'include',
                childs: currentNode.childs,
                parent: currentNode.parent,
                variable: item.value,
                path: includePath
              }

              if (item.type === 'single_tag') {
                tree.push(includeNode)
              } else {
                tree.replace(currentNode, [includeNode])

                includeNode.childs.forEach(setParent.bind(null, includeNode))

                tree.currentNode = includeNode
              }
            }
          }
        }
      }
    }
  }
}
