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
'  function str(str, len, sprtr) {\n' +
'    if (!len) len = 0;\n' +
'    if (typeof str.toString === \'function\') str = str.toString();\n' +
'    if (!sprtr) sprtr = \'.\';\n' +
'    if (~str.indexOf(\'.\')) {\n' +
'      if (len > 0) {\n' +
'        str = str.substr(0, str.indexOf(\'.\') + len + 1);\n' +
'      } else {\n' +
'        str = str.substr(0, str.indexOf(\'.\') + len);\n' +
'      }\n' +
'    } else {\n' +
'      str = str_pad(str + \'.\', str.length + 1 + len, \'0\');\n' +
'    }\n' +
'    return str.replace(\'.\', sprtr);\n' +
'  }\n' +
'  function str_replace(str, src, rep) {\n' +
'    while (~str.indexOf(src)) {\n' +
'      str = str.replace(src, rep);\n' +
'    }\n' +
'    return str;\n' +
'  }\n' +
'  var STRPADRIGHT = 1 << 1;\n' +
'  var STRPADLEFT = 2 << 1;\n' +
'  var STRPADBOTH = 4 << 1;\n' +
'  function __str_pad_repeater(str, len) {\n' +
'    var collect = \'\', i;\n' +
'    while(collect.length < len) collect += str;\n' +
'    collect = collect.substr(0, len);\n' +
'    return collect;\n' +
'  }\n' +
'  function str_pad(str, len, sub, type) {\n' +
'    if (typeof type === \'undefined\') type = STRPADRIGHT;\n' +
'    var half = \'\', pad_to_go;\n' +
'    if ((pad_to_go = len - str.length) > 0) {\n' +
'      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }\n' +
'      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }\n' +
'      else if (type & STRPADBOTH) {\n' +
'        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));\n' +
'        str = half + str + half;\n' +
'        str = str.substr(0, len);\n' +
'      }\n' +
'    }\n' +
'    return str;\n' +
'  }\n' +
'  function str_htmlescape(html) {\n' +
'    return html.replace(/&/g, "&amp;")\n' +
'    .replace(/</g, "&lt;")\n' +
'    .replace(/>/g, "&gt;")\n' +
'    .replace(/"/g, "&quot;");\n' +
'  }\n' +
'  function str_upfirst(str) {\n' +
'    return str.split(/[\\s\\n\\t]+/).map(function (item) {\n' +
'      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();\n' +
'    }).join(\' \');\n' +
'  }\n' +
'  function str_camel(str) {\n' +
'    return str.split(/[\\s\\n\\t]+/).map(function (item, index) {\n' +
'      if (!index) return item;\n' +
'      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();\n' +
'    }).join(\'\');\n' +
'  }\n' +
'  function str_kebab(str) {\n' +
'    return str.split(/[\\s\\n\\t]+/).join(\'-\');\n' +
'  }\n' +
'  function arr_values(obj) {\n' +
'    var values = [], i;\n' +
'    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);\n' +
'    return values;\n' +
'  }\n' +
'  function arr_contain(obj, value) {\n' +
'    if(typeof obj.indexOf === \'function\') return obj.indexOf(value) !== -1;\n' +
'    var i;\n' +
'    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;\n' +
'    return false;\n' +
'  }\n' +
'  function arr_len(obj) {\n' +
'    if(typeof obj.length !== \'undefined\') return obj.length;\n' +
'    var i, length = 0;\n' +
'    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;\n' +
'    return length;\n' +
'  }\n' +
'  function arr_push(arr, value) {\n' +
'    arr.push(value);\n' +
'    return \'\';\n' +
'  }\n' +
'  function arr_unshift(arr, value) {\n' +
'    arr.unshift(value);\n' +
'    return \'\';\n' +
'  }\n' +
'  function arr_rand(arr, value) {\n' +
'    var keys = Object.keys(arr);\n' +
'    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];\n' +
'  }\n' +
'  function arr_splice(arr, st, en, els) {\n' +
'    var prms = [st];\n' +
'    if (typeof en !== \'undefined\') prms.push(en);\n' +
'    return Array.prototype.splice.apply(arr, prms.concat(els));\n' +
'  }\n' +
'  function arr_pad(src, len, el) {\n' +
'    var i, arr = src.slice(0);\n' +
'    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);\n' +
'    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);\n' +
'    return arr;\n' +
'  }\n' +
'  function arr_reverse(src) {\n' +
'    var arr = src.slice(0);\n' +
'    arr.reverse();\n' +
'    return arr;\n' +
'  }\n' +
'  function arr_sort(src) {\n' +
'    var arr = src.slice(0);\n' +
'    arr.sort();\n' +
'    return arr;\n' +
'  }\n' +
'  function arr_sort_reverse(src) {\n' +
'    var arr = src.slice(0);\n' +
'    arr.sort();\n' +
'    arr.reverse();\n' +
'    return arr;\n' +
'  }\n' +
'  function arr_unique(src) {\n' +
'    var i, arr = [];\n' +
'    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);\n' +
'    return arr;\n' +
'  }\n' +
'  function arr_key(arr, value) {\n' +
'    var i;\n' +
'    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;\n' +
'    return -1;\n' +
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
var definedVars = [
  'data',
  'childs',
  'MKARR_OPEN',
  'MKARR_CLOSE',
  'STRPADRIGHT',
  'STRPADLEFT',
  'STRPADBOTH'
]
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
  return '_childs.push(create(' + (value) + '));\n'
}

function modeVariableConcat (variable, value) {
  return variable + ' += ' + (value) + ';\n'
}

function modeIncludeChilds (childs, value) {
  return childs + '.push(create(' + (value) + '));\n'
}

function modePassParam (value) {
  return value
}

function handleParams (params) {
  return params.map(function (attr) {
    return expression(attr)
  })
}

function handleFunction (tree) {
  var strParam
  var funcName
  var params

  funcName =
    (tree.value.type === 'var' && !tree.value.keys.length ? tree.value.value : expression(tree.value))

  switch (funcName) {
    case 'str_sub':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      if (params[1]) {
        params[1] = '(' + params[1] + ' < 0 ? ' + strParam + '.length  + (' + params[1] + ') - ' + params[0] + ' : ' + params[1] + ')'
      }

      return strParam + '.substr(' + params.join(', ') + ')'
    case 'str_len':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.length'
    case 'str_pos':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.indexOf(' + params.join(', ') + ')'
    case 'str_split':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.split(' + params.join(', ') + ')'
    case 'str_lower':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.toLowerCase()'
    case 'str_upper':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.toUpperCase()'
    case 'str_trim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.trim()'
    case 'str_ltrim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.replace(/^[\\s\\n\\t]*/, \'\')'
    case 'str_rtrim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.replace(/[\\s\\n\\t]*$/, \'\')'
    case 'str_urlencode':
      return 'encodeURIComponent(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_urldecode':
      return 'decodeURIComponent(' + handleParams(tree.attrs).join(', ') + ')'

    case 'arr_keys':
      return 'Object.keys(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_values':
      return 'arr_values(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_pop':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.pop()'
    case 'arr_shift':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.shift()'
    case 'arr_slice':
      params = handleParams(tree.attrs)
      strParam = params.shift()
      if (params[1]) params[1] = parseInt(params[0], 10) + parseInt(params[1], 10)

      return strParam + '.slice(' + params.join(', ') + ')'

    case 'num_int':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return 'parseInt(' + strParam + ', 10)'
    case 'num_float':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return 'parseFloat(' + strParam + ')'
    case 'num_pow':
      return 'Math.pow(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_abs':
      return 'Math.abs(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_sin':
      return 'Math.sin(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_cos':
      return 'Math.cos(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_tan':
      return 'Math.tan(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_acos':
      return 'Math.acos(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_asin':
      return 'Math.asin(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_atan':
      return 'Math.atan(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_round':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return '(' + strParam + ' < 0 ? Math.round(' + strParam + ') : Math.round(' + strParam + '))'
    case 'num_rand':
      return 'Math.random()'
    case 'num_sqrt':
      return 'Math.sqrt(' + handleParams(tree.attrs).join(', ') + ')'
    default:
      return funcName + '(' + handleParams(tree.attrs).join(', ') + ')'
  }
}

function handleArray (source) {
  var key = 0
  var isKeyProper = true
  var result = []
  var str = ''

  source.forEach(function (item) {
    if (item.key !== null) {
      isKeyProper = false;
    }
  })

  if (isKeyProper) {
    source.forEach(function (item) {
      result.push(expression(item.value))
    })

    return '[' + result.join(',') + ']'
  }

  result = {}

  source.forEach(function (item) {
    if (item.key === null) {
      result[key++] = expression(item.value)
    } else {
      result[expression(item.key)] = expression(item.value)
    }
  })

  str = []

  for (key in result) {
    str.push('_arr[' + key + '] = ' + result[key] + ';')
  }

  return '(function () { var _arr = {}; ' + str.join(' ') + ' return _arr;})()'
}

function expression (tree) {
  var str = ''

  if (typeof tree === 'string') return prepareText(tree)

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

      return handleFunction(tree)
    case 'concat':
      return tree.value.map(function (item) {
        return expression(item)
      }).join(' + ')
    case 'array':
      if (tree.range) {
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

      return handleArray(tree.values)
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
