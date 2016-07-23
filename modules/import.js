var path = require('path')
var cacheTemplates = {}
var Parser = require('../parsers/parser')
var clone = require('../parsers/clone')

function insertChildsToTemplate (tree, templates, nodes) {
  templates.forEach(function (item) {
    if (tree.match(item, 'type[expr].type[var].childs')) {
      tree.replace(item, nodes)
    }

    if (item.childs && item.childs.length) {
      insertChildsToTemplate(tree, item.childs, nodes)
    }
  })
}

function setParent (parent, item) {
  item.parent = parent
}

module.exports = {
  check: function (tree, item) {
    var funcParams
    var includePath
    var nameSpace = tree.filePath()
    var childs
    var i
    var len
    var parser = Parser(tree.modules())
    var template
    var parent

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
          template: null,
          names: {}
        }

        cacheTemplates[includePath].template = parser.parseFile(includePath + '.txt')
      }

      if (!cacheTemplates[includePath].names[nameSpace]) {
        cacheTemplates[includePath].names[nameSpace] = []
      }

      cacheTemplates[includePath].names[nameSpace].push(funcParams[0].value)

      tree.skip()
    } else if (item.type === 'close_tag') {
      for (includePath in cacheTemplates) {
        if (cacheTemplates[includePath].names[nameSpace]) {
          for (i = 0, len = cacheTemplates[includePath].names[nameSpace].length; i < len; i += 1) {
            if (cacheTemplates[includePath].names[nameSpace][i] === item.value) {
              parent = tree.currentNode.parent

              template = clone(cacheTemplates[includePath].template.tree())

              childs = tree.currentNode.childs

              insertChildsToTemplate(tree, template.childs, childs)

              tree.replace(tree.currentNode, template.childs)

              parent.childs.forEach(setParent.bind(null, parent))

              tree.currentNode = template.childs[template.childs.length - 1]
            }
          }
        }
      }
    }
  }
}
