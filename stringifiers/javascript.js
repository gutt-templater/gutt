var prefix =
'(function (factory) {\n' +
'  if (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n' +
'    module.exports = factory();\n' +
'  } else if (typeof define !== \'undefined\' && typeof define.amd !== \'undefined\') {\n' +
'    define([], factory());\n' +
'  }\n' +
'})(function () {\n' +
'  var MKARR_OPEN = 2 << 1;\n' +
'  var MKARR_CLOSE = 1 << 1;\n' +
'  function mkArr(start, end, flag) {\n' +
'    var arr = [], i;\n' +
'    if (flag & MKARR_OPEN) {\n' +
'      if (start <= end) {\n' +
'        for (i = start; i < end; i++) {\n' +
'          arr.push(i);\n' +
'        }\n' +
'      } else {\n' +
'        for (i = start; i > end; i--) {\n' +
'          arr.push(i);\n' +
'        }\n' +
'      }\n' +
'    } else if (flag & MKARR_CLOSE) {\n' +
'      if (start <= end) {\n' +
'        for (i = start; i <= end; i++) {\n' +
'          arr.push(i);\n' +
'        }\n' +
'      } else {\n' +
'        for (i = start; i >= end; i--) {\n' +
'          arr.push(i);\n' +
'        }\n' +
'      }\n' +
'    }\n' +
'    return arr;\n' +
'  }\n' +
'  function create(name, attrs, cb) {\n' +
'    if (typeof name === \'object\') return name;\n' +
'    var childs = [];\n' +
'    if (typeof cb === \'function\') cb(childs);\n' +
'    if (attrs) {\n' +
'      return {\n' +
'        type: \'node\',\n' +
'        name: name,\n' +
'        attrs: attrs,\n' +
'        childs: childs\n' +
'      };\n' +
'    }\n' +
'    return {\n' +
'      type: \'text\',\n' +
'      text: name\n' +
'    };\n' +
'  }\n' +
'  return function (data, childs) {\n' +
'    var _childs = [];\n'
var postfix =
'    return _childs;\n' +
'  };\n' +
'});'
var variableIncrement = 0
var definedVars = ['data', 'childs']
var undefinedVars = []

function prepareText (text) {
  return text.replace(/\n/g, '\\n')
}

function getVariableIncrement () {
  return variableIncrement++
}

function defineVar (variable) {
  if (!~undefinedVars.indexOf(variable) && !~definedVars.indexOf(variable)) {
    undefinedVars.push(variable)
  }
}

function defineVars (vars) {
  if (vars.length) {
    return 'var ' + vars.join(', ') + ';\n'
  }

  return ''
}

function modeChilds (value) {
  return '_childs.push(create(' + value + '));\n'
}

function modeVariableConcat (variable, value) {
  return variable + ' += ' + value + ';\n'
}

function modeIncludeChilds (childs, value) {
  return childs + '.push(create(' + value + '));\n'
}

function modePassParam (value) {
  return value
}

function expression (tree) {
  var str = ''

  if (typeof tree === 'string') return tree

  switch (tree.type) {
    case 'var':
      if (!~definedVars.indexOf(tree.value)) {
        tree.keys.unshift('\'' + tree.value + '\'')
        tree.value = 'data'
      }

      str += tree.value + tree.keys.map(function (key) {
        return '[' + expression(key) + ']'
      }).join('')

      return str
    case 'num':
      str += tree.value

      return str
    case 'plus':
      str += expression(tree.value[0]) + ' + ' + expression(tree.value[1])

      return str
    case 'minus':
      str += expression(tree.value[0]) + ' - ' + expression(tree.value[1])

      return str
    case 'mult':
      str += expression(tree.value[0]) + ' * ' + expression(tree.value[1])

      return str
    case 'divis':
      str += expression(tree.value[0]) + ' / ' + expression(tree.value[1])

      return str
    case 'or':
      str += expression(tree.value[0]) + ' || ' + expression(tree.value[1])

      return str
    case 'and':
      str += expression(tree.value[0]) + ' && ' + expression(tree.value[1])

      return str
    case 'bitor':
      str += expression(tree.value[0]) + ' | ' + expression(tree.value[1])

      return str
    case 'bitand':
      str += expression(tree.value[0]) + ' & ' + expression(tree.value[1])

      return str
    case 'notequal':
      str += expression(tree.value[0]) + ' != ' + expression(tree.value[1])

      return str
    case 'equal':
      str += expression(tree.value[0]) + ' == ' + expression(tree.value[1])

      return str
    case 'gtequal':
      str += expression(tree.value[0]) + ' >= ' + expression(tree.value[1])

      return str
    case 'gt':
      str += expression(tree.value[0]) + ' > ' + expression(tree.value[1])

      return str
    case 'lt':
      str += expression(tree.value[0]) + ' < ' + expression(tree.value[1])

      return str
    case 'ltequal':
      str += expression(tree.value[0]) + ' <= ' + expression(tree.value[1])

      return str
    case 'isset':
      str += 'isset(' + expression(tree.value) + ')'

      return str
    case 'not':
      str += '!' + expression(tree.value)

      return str
    case 'brack':
      str += '(' + expression(tree.value) + ')'

      return str
    case 'uminus':
      str += '-' + expression(tree.value)

      return str
    case 'func':
      str +=
        (tree.value.type === 'var' && !tree.value.keys.length ? tree.value.value : expression(tree.value))
      str += '(' + tree.attrs.map(function (attr) {

        return expression(attr)
      }).join(', ') + ')'

      return str

    case 'concat':
      return tree.value.map(function (item) {
        return expression(item)
      }).join(' + ')

    case 'array':
      switch (tree.range.type) {
        case 'empty':
          return '[]'

        case 'open':
          str = 'mkArr(' + expression(tree.range.value[0])
          str += ', ' + expression(tree.range.value[1])
          str += ', MKARR_OPEN)'

          return str

        case 'close':
          str = 'mkArr(' + expression(tree.range.value[0])
          str += ', ' + expression(tree.range.value[1])
          str += ', MKARR_CLOSE)'

          return str
      }
  }

  return str
}

function switchNode (node, mode) {
  var result = ''
  var randomVar
  var params
  var paramsArr
  var variable
  var attrValueVar
  var value
  var childsVar

  switch (node.type) {
    case 'tag':
      paramsArr = '_params' + getVariableIncrement()
      result += 'var ' + paramsArr + ' = [];\n'

      node.attrs.childs.forEach(function (attr) {
        attrValueVar = '_attrValue' + getVariableIncrement()

        result += '(function () {\n'
        result += '  var ' + attrValueVar + ' = \'\';\n'
        result += reduce(attr.value.childs, modeVariableConcat.bind(null, attrValueVar))
        result += paramsArr + '.push({name: \'' + attr.name + '\', value: ' + attrValueVar + '});\n'
        result += '})();\n'
      })

      result +=
        mode('\'' + node.value + '\', ' + paramsArr + ', function (_childs) {\n' +
        reduce(node.childs, mode) +
        '}')

      return result
    case 'single_tag':
      paramsArr = '_params' + getVariableIncrement()
      result += 'var ' + paramsArr + ' = [];\n'

      node.attrs.childs.forEach(function (attr) {
        attrValueVar = '_attrValue' + getVariableIncrement()

        result += '(function () {\n'
        result += '  var ' + attrValueVar + ' = \'\';\n'

        if (attr.value) {
          result += reduce(attr.value.childs, modeVariableConcat.bind(null, attrValueVar));
        } else if (attr.string) {
          result += reduce(attr.string.childs, modeVariableConcat.bind(null, attrValueVar));
        }

        result += paramsArr + '.push({name: \'' + attr.name + '\', value: ' + attrValueVar + '});\n'
        result += '})();\n'
      })

      result += mode('\'' + node.value + '\', ' + paramsArr)

      return result
    case 'comment':
      result += ''

      return result
    case 'assign':
      result += expression(node.value) + ' = ' + expression(node.expr) + ';\n'

      return result
    case 'if':
      result += 'if (' + expression(node.value) + ') {\n'
      result += reduce(node.childs, mode)

      return result
    case 'elseif':
      result += '} else if (' + expression(node.value) + ') {\n'
      result += reduce(node.childs, mode)

      return result
    case 'else':
      result += '} else {\n'
      result += reduce(node.childs, mode)

      return result
    case 'endif':
      result += '}\n'

      return result
    case 'for':
      randomVar = '_arr' + getVariableIncrement()
      result += 'var ' + randomVar + ' = '

      if (node.value.length === 2) {
        result += expression(node.value[1])
      } else if (node.value.length === 3) {
        result += expression(node.value[2])
      }

      result += ';\n'
      result += 'for ('
      defineVar(node.value[0].value)

      result += expression(node.value[0]) + ' in ' + randomVar
      result += ') {\n'

      result +=
        expression(node.value[0]) + ' = ' + randomVar + '[' + expression(node.value[0]) + '];\n'

      result += reduce(node.childs, mode)

      result += '}\n'

      return result
    case 'expr':
      if (node.value.type === 'var' && node.value.value === 'childs' && !node.value.keys.length) {
        result += 'if (childs) {\n'
        result += 'childs.forEach(function (child) {\n'
        result += mode('child')
        result += '});\n'
        result += '}\n'

        return result
      }

      if (node.value.type === 'isset') {
        variable = expression(node.value.value)

        value = 'typeof ' + variable + ' !== \'undefined\' ? ' + variable + ' : \'\''
      } else {
        value = expression(node.value)
      }

      result += mode(value)

      return result
    case 'text':
      result += mode('\'' + prepareText(node.value) + '\'')

      return result
    case 'param':
      if (node.value) {
        if (node.value.childs.length) {
          result += reduce(node.value.childs, mode)
        }

        return ' ' + node.name + (result.length ? '=\'' + result + '\'' : '')
      }

      if (node.string) {
        if (node.string.childs.length) {
          result += reduce(node.string.childs, mode)
        }

        return ' ' + (result.length ? '\'' + result + '\'' : '')
      }

      return ''
    case 'include':
      randomVar = '_resultChilds' + getVariableIncrement()
      childsVar = '_includeChilds' + getVariableIncrement()

      result += 'var _' + node.variable + ' = require(\'' + node.path + '\');\n'
      result += 'var ' + childsVar + ' = [];\n'
      result += reduce(node.childs, modeIncludeChilds.bind(null, childsVar)) + ';\n'

      params = node.params.childs.map(function (param) {
        if (param.value.childs && param.value.childs[0].type === 'expr') {
          return '\'' + param.name + '\': ' + expression(param.value.childs[0].value);
        }

        return '\'' + param.name + '\': ' + reduce(param.value.childs || param.value, modePassParam)
      })

      result += 'var ' + randomVar + ' = _' + node.variable + '({' + params.join(',\n') + '}, ' + childsVar + ');\n'
      result += randomVar + '.forEach(function (child) {\n'
      result += mode('child')
      result += '});\n'

      return result
  }

  return ''
}

function reduce (tree, mode) {
  var result = ''

  tree.forEach(function (node) {
    result += switchNode(node, mode)
  })

  return result
}

module.exports = {
  ext: 'js',
  stringify: function (tree) {
    var result

    variableIncrement = 0

    undefinedVars.splice(0)

    result = reduce(tree.childs, modeChilds)

    return prefix + defineVars(undefinedVars) + result + postfix
  }
}
