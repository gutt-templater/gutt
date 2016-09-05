var path = require('path')
var Parser = require('../parsers/parser')
var parser

function setParent (parent, item) {
  item.parent = parent
}

function prepareAttr (tree, attr) {
  if (attr.value.type === 'logic') {
    attr.value = parser.parse([attr.value], tree.filePath()).tree()
  }
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
    var rootPath = tree.getRootPath() || path.dirname(nameSpace)

    if (!tree.cacheTemplates) {
      tree.cacheTemplates = {}
    }

    if (!parser) {
      parser = Parser(tree.modules())
    }

    if (tree.match(item, 'type[logic].type[expr].type[func].type[var].import')) {
      funcParams = item.value.value.attrs

      if (!funcParams[0] || funcParams[0].type !== 'var' || funcParams[0].keys.length) {
        throw new Error('Syntax error: wrong component name')
      }

      if (!funcParams[1] || typeof funcParams[1] !== 'string') {
        throw new Error('Syntax error: wrong component path. Should by string')
      }

      includePath = funcParams[1].substr(1, funcParams[1].length - 2)

      includePath = path.resolve(rootPath, includePath)

      if (!tree.cacheTemplates[includePath]) {
        tree.cacheTemplates[includePath] = {
          names: {}
        }
      }

      if (!tree.cacheTemplates[includePath].names[nameSpace]) {
        tree.cacheTemplates[includePath].names[nameSpace] = []
      }

      tree.cacheTemplates[includePath].names[nameSpace].push(funcParams[0].value)

      tree.skip()
    } else if (item.type === 'close_tag' || item.type === 'single_tag') {
      for (includePath in tree.cacheTemplates) {
        if (tree.cacheTemplates[includePath].names[nameSpace]) {
          for (i = 0, len = tree.cacheTemplates[includePath].names[nameSpace].length; i < len; i += 1) {
            if (tree.cacheTemplates[includePath].names[nameSpace][i] === item.value) {
              currentNode = tree.currentNode

              if (item.type === 'single_tag') {
                currentNode = item
                currentNode.attrs = parser.parse(currentNode.attrs, tree.filePath()).tree()
              }

              if (!currentNode.childs) {
                currentNode.childs = []
              }

              currentNode.attrs.childs.forEach(prepareAttr.bind(null, tree))

              parent = currentNode.parent
              includeNode = {
                type: 'include',
                params: currentNode.attrs,
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
