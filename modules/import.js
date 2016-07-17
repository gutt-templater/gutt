var path = require('path')
var cacheTemplates = {}

function insertChildsToTemplate (helper, templates, nodes) {
  templates.forEach(function (item) {
    if (helper.logicMatch(item, 'type[expr].type[var].childs')) {
      helper.replace(item, nodes)
    }

    if (item.childs && item.childs.length) {
      insertChildsToTemplate(helper, item.childs, nodes)
    }
  })
}

module.exports = {
  check: function (helper, item) {
    var funcParams
    var includePath
    var nameSpace = helper.filePath()

    if (helper.logicMatch(item, 'type[logic].type[expr].type[func].type[var].import')) {
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

        cacheTemplates[includePath].template = helper.parser.parseFile(includePath + '.txt')
      }

      if (!cacheTemplates[includePath].names[nameSpace]) {
        cacheTemplates[includePath].names[nameSpace] = []
      }

      cacheTemplates[includePath].names[nameSpace].push(funcParams[0].value)

      // а затем заменить текущее дерево на поделюченный шаблон с замененным childs на текущее дерево
    }
  },

  closeNeste: function (helper, item) {
    var includePath
    var i
    var len
    var nameSpace = helper.filePath()
    var childs
    var childsLength

    if (item.type === 'open_tag') {
      for (includePath in cacheTemplates) {
        if (cacheTemplates[includePath].names[nameSpace]) {
          for (i = 0, len = cacheTemplates[includePath].names[nameSpace].length; i < len; i += 1) {
            if (cacheTemplates[includePath].names[nameSpace][i] === item.value) {
              childs = item.childs

              childsLength = cacheTemplates[includePath].template.childs.length

              helper.replace(item, cacheTemplates[includePath].template.childs)

              insertChildsToTemplate(helper, cacheTemplates[includePath].template.childs, childs)
            }
          }
        }
      }
    }
  }
}
